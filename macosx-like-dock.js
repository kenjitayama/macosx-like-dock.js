/* MacStyleDock.js - a function for creating a Mac-OSX-style dock
 *
 * The author of this program, Safalra (Stephen Morley), irrevocably releases
 * all rights to this program, with the intention of it becoming part of the
 * public domain. Because this program is released into the public domain, it
 * comes with no warranty either expressed or implied, to the extent permitted
 * by law.
 *
 * For more public domain JavaScript code by the same author, visit:
 *
 * http://www.safalra.com/web-design/javascript/
 * ----------------------------------------------------------------------------
 * 2009/01/22
 * Forked version created by Kenji Tayama.
 *
 * Hosted on GitHub
 * http://github.com/kenjitayama/macosx-like-dock.js
 *
 * Now supports rectangular icons and captions images with sizes independent from the 
 * icon images(so that long captions can be displayed over the icons).
 */


/* Creates a MacStyleDock. A MacStyleDock is a row of images that expand as the
 * mouse pointer moves over them. The images are created as children of the
 * specified node with the specified minimum and maximum sizes. Two other
 * parameters specify the images to be used and the range of expansion. The
 * parameters are:
 *
 * node           - the node at which to create the Mac-style 'dock
 * imageDetails   - an array each of whose elements are objects with three
 *                  properties:
 *                  - name      - the basename of the image
 *                  - sizes     - an array of pixel sizes available. 
 *                    Each element is an object of {width: x, height: y}
 *                    (x, y are integers).
 *                  - extension - the image extension
 *                  - onclick   - the function to call when the image is clicked
 *                    Requested file names consist of the concatenation of the name
 *                    property, one of the values of the size property, the string
 *                    '-reflection' for reflections, the string '-full' for full
 *                    versions (so for example, captions can be added), and the extension property.
 *                    There are also the {name}_caption.xxx and {name}_capton-full.xxx for adding
 *                    captions with sizes independent from the icon images. For the former,
 *                    provide a plain image with the same color as the background,
 *                    and for the latter, provide a image that is the same as the former, except
 *                    that it has the caption inside it.
 * minimumSize    - minimum size of icons in the dock. An object of 
 *                  {width: x, height: y} (x, y are integers).
 * maximumSize    - maximum size of icons in the dock. An object of 
 *                  {width: x, height: y} (x, y are integers).
 * captionSize    - size of caption icons in the dock. An object of 
 *                  {width: x, height: y} (x, y are integers).
 * range          - the range of expansion, in icons. This must be an integer.
 * hideReflection - boolean value, whether to hide reflection image or not
 * hideFullSize    - boolean value, whether to hide the "-full.xxx" images or not
 * hideCaption    - boolean value, whether to hide the "_caption.xxx", "_caption-full.xxx" images or not
 */
function MacStyleDock(node, imageDetails, minimumSize, maximumSize, captionSize, range, hideReflection, hideFullSize, hideCaption){

  // create a container for the captions of icons and add it to the dock container
  var captionOfIconsNode = document.createElement('div');
  node.appendChild(captionOfIconsNode);

  // create a container for the icons and add it to the dock container
  var iconsNode = document.createElement('div');
  node.appendChild(iconsNode);

  // create a container for the reflected icons and add it to the dock container
  var reflectedIconsNode = document.createElement('div');
  node.appendChild(reflectedIconsNode);

  // set the icon containers to centre its contents
  iconsNode.style.textAlign          = 'center';
  reflectedIconsNode.style.textAlign = 'center';
  captionOfIconsNode.style.textAlign = 'center';
  captionOfIconsNode.style.whiteSpace = 'nowrap';
  
  // set the height of the dock containers to equal that of the maximised icons
  iconsNode.style.height  = maximumSize.height + 'px';
  if (hideReflection) {
    reflectedIconsNode.style.display = 'none';
  } else {
    reflectedIconsNode.style.height  = maximumSize.height + 'px';
  }

  // initialise the maximum width to 0
  var maximumWidth  = 0;

  // initialise the maximum height to 0
  var maximumHeight  = 0;
  
  // initialise the scale factor to 0
  var scale  = 0;
  
  // initialise the time-outs and intervals to 0
  var closeTimeout  = null;
  var closeInterval = null;
  var openInterval  = null;
  
  // create an array to store images
  var images = [];
  
  // create an array to store the DOM nodes of captions of the icons
  var captionOfIconNodes = [];

  // create an array to store the DOM nodes of the icons
  var iconNodes = [];
  
  // create an array to store the DOM nodes of reflections of the icons
  var reflectedIconNodes = [];
  
  // create an array to store the sizes of the icons. Each element is an object of {width: x, heigth: y} (x, y are integers).
  var iconSizes = [];
  
  // loop over the images
  for (var i = 0; i < imageDetails.length; i++){
  
    // create and store a node for the icon for this image
    iconNodes[i] = document.createElement('img');
    
    // position the icon for this image relatively
    iconNodes[i].style.position = 'relative';

    // store the initial size of the icon for this image
    iconSizes[i] = {width: minimumSize.width, height: minimumSize.height};
    
    // create and store a node for the caption of the icon for this image
    if (! hideCaption) {
        captionOfIconNodes[i] = document.createElement('img');
    }

    // create and store a node for the reflected icon for this image
    reflectedIconNodes[i] = document.createElement('img');
    
    // update the properties of the icon for this image
    updateIconProperties(i);

    // add the span for this image to the dock
    if (! hideCaption) {
        captionOfIconsNode.appendChild(captionOfIconNodes[i]);
    }

    // add the span for this image to the dock
    iconsNode.appendChild(iconNodes[i]);
    
    // add the span for this image to the dock
    reflectedIconsNode.appendChild(reflectedIconNodes[i]);
    
    // add the appropriate event listeners to the icon for this image
    if (iconNodes[i].addEventListener){
      iconNodes[i].addEventListener('mousemove', processMouseMove, false); 
      iconNodes[i].addEventListener('mouseout', processMouseOut, false);
      iconNodes[i].addEventListener('click', imageDetails[i].onclick, false);
    }else if (iconNodes[i].attachEvent){
      iconNodes[i].attachEvent('onmousemove', processMouseMove);
      iconNodes[i].attachEvent('onmouseout', processMouseOut);
      iconNodes[i].attachEvent('onclick', imageDetails[i].onclick);
    }

    // loop over the sizes available for this image
    for (var j = 0; j < imageDetails[i].sizes.length; j++){
    
      // create a DOM node containing this image at this size 
      var image = document.createElement('img');
      image.setAttribute(
          'src',
          imageDetails[i].name
              + imageDetails[i].sizes[j].width
              + '_'
              + imageDetails[i].sizes[j].height
              + imageDetails[i].extension);
              
      // add the DOM node to the array of stored images
      images.push(image);
      
    }
    
  }


  /* Sets a toolbar image to the specified size. The parameter is:
   *
   * index - the 0-based index of the image to be sized
   */
  function updateIconProperties(index){
  
    // determine the size for the icon, taking into account the scale factor
    var size = {width: 0, height: 0};
    size.width = minimumSize.width + scale * (iconSizes[index].width - minimumSize.width);
    size.height = minimumSize.height + scale * (iconSizes[index].height - minimumSize.height);
    
    // find the index of the appropriate image size
    var sizeIndex = 0;
    while (imageDetails[index].sizes[sizeIndex].width < size.width
        && sizeIndex + 1 < imageDetails[index].sizes.length){
      sizeIndex++;
    }

    // check whether the full size icon should be displayed
    if (size.width == maximumSize.width && ! hideFullSize){
    
      // set the src attribute of the image for the icon
      iconNodes[index].setAttribute('src',
          imageDetails[index].name
              + maximumSize.width
              + '_'
              + maximumSize.height
              + '-full'
              + imageDetails[index].extension);
      
      // set the src attribute of the caption image for the icon
      if (! hideCaption) {
          captionOfIconNodes[index].setAttribute('src',
                  imageDetails[index].name
                  + 'caption-full'
                  + imageDetails[index].extension);

          // calculate offset of the bottle/caption center from the total center
          var idx = 0;
          var n = iconSizes.length;
          var iconsLengthTotal = 0;
          for (idx = 0; idx < n; idx++) {
              iconsLengthTotal += iconSizes[idx].width;
          }
          var untilSelectedCenter = 0;
          for (idx = 0; idx < index; idx++) {
              untilSelectedCenter += iconSizes[idx].width;
          }
          untilSelectedCenter += iconSizes[index].width / 2;
          var offset = untilSelectedCenter - iconsLengthTotal / 2;

          // width left and right of the full sized caption
          var wl;
          var wr;
          if (offset > 0) {
              wl = 2 * offset;
              wr = 0;
          } else {
              wl = 0;
              wr = 2 * offset * (-1);
          }

          // set the width and height of the full sized caption image for the icon
          captionOfIconNodes[index].setAttribute('width', captionSize.width);
          captionOfIconNodes[index].setAttribute('height', captionSize.height);

          // set the width and height of the other caption images for the icons
          if (index == 0) {
              for (idx = 1; idx < n; idx++) {
                  captionOfIconNodes[idx].setAttribute('width', -1 * offset * 2 / (n - 1));
                  captionOfIconNodes[idx].setAttribute('height', captionSize.height);
              }
          } else if (index == iconSizes.length - 1) {
              for (idx = 0; idx < n - 1; idx++) {
                  captionOfIconNodes[idx].setAttribute('width', offset * 2 / (n - 1));
                  captionOfIconNodes[idx].setAttribute('height', captionSize.height);
              }
          } else {
              for (idx = 0; idx < index; idx++) {
                  captionOfIconNodes[idx].setAttribute('width', wl / index);
                  captionOfIconNodes[idx].setAttribute('height', captionSize.height);
              }
              for (idx = index + 1; idx < n; idx++) {
                  captionOfIconNodes[idx].setAttribute('width', wr / (n - index -1));
                  captionOfIconNodes[idx].setAttribute('height', captionSize.height);
              }
          }
        }
    } else {
    
      // set the src attribute of the image for the icon
      iconNodes[index].setAttribute('src',
          imageDetails[index].name
              + imageDetails[index].sizes[sizeIndex].width
              + '_'
              + imageDetails[index].sizes[sizeIndex].height
              + imageDetails[index].extension);

      // set the src attribute of the caption image for the icon
      if (! hideCaption) {
          captionOfIconNodes[index].setAttribute('src',
              imageDetails[index].name
              + 'caption'
              + imageDetails[index].extension);
      }
    }

    // set the width and height of the image for the icon
    iconNodes[index].setAttribute('width',  size.width);
    iconNodes[index].setAttribute('height', size.height);

    // set the src, width, heigth attribute of the image for the icon's reflection
    if (! hideReflection) {
        reflectedIconNodes[index].setAttribute('src',
            imageDetails[index].name
                + imageDetails[index].sizes[sizeIndex].width
                + '_'
                + imageDetails[index].sizes[sizeIndex].height
                + '-reflection'
                + imageDetails[index].extension);
            
            reflectedIconNodes[index].setAttribute('width',  size.width);
            reflectedIconNodes[index].setAttribute('height', size.height);
    }
    

    // set the top margin of the image for the icon
    iconNodes[index].style.marginTop = (maximumSize.height - size.height) + 'px';
    reflectedIconNodes[index].style.marginBottom = (maximumSize.height - size.height) + 'px';
    
  }
  

  /* Processes a mousemove event on an image in the 'dock'. The parameter is:
   *
   * e - the event object. window.event will be used if this is undefined.
   */
  function processMouseMove(e){
   
    // clear the closing interval and time-out
    window.clearTimeout(closeTimeout);
    closeTimeout = null;
    window.clearInterval(closeInterval);
    closeInterval = null;
    
    // check that the opening interval is required but does not yet exist
    if (scale != 1 && !openInterval){
    
      // create the opening interval
      openInterval = window.setInterval(
          function(){
            if (scale < 1) scale += 0.125;
            if (scale >= 1){
              scale = 1;
              window.clearInterval(openInterval);
              openInterval = null;
            }
            for (var i = 0; i < iconNodes.length; i++){
              updateIconProperties(i);
            }
          },
          20);
          
    }
    
    // set the event object if the browser does not supply it
    if (!e) e = window.event;
    
    // find the DOM node on which the mouseover event occured
    var target = e.target || e.srcElement;
    
    // obtain the index of the icon on which the mouseover event occured
    var index = 0;
    while (iconNodes[index] != target) index++;
    
    // obtain the fraction across the icon that the mouseover event occurred
    var across = (e.layerX || e.offsetX) / iconSizes[index].width;
    
    // check a distance across the icon was found (in some cases it will not be)
    if (across){
    
      // initialise the current width to 0
      var currentWidth = 0;
    
      // initialise the current height to 0
      var currentHeight = 0;
      
      // loop over the icons
      for (var i = 0; i < iconNodes.length; i++){
      
        // check whether the icon is in the range to be resized
        if (i < index - range || i > index + range){
        
          // set the icon size to the minimum size
          iconSizes[i].width = minimumSize.width;
          iconSizes[i].height = minimumSize.height;
          
        }else if (i == index){
        
          // set the icon size to be the maximum size
          iconSizes[i].width = maximumSize.width;
          iconSizes[i].height = maximumSize.height;
        
        }else if (i < index){
        
          // set the icon size to the appropriate value
          iconSizes[i].width =
              minimumSize.width
              + Math.round(
                  (maximumSize.width - minimumSize.width - 1)
                  * (
                      Math.cos(
                          (i - index - across + 1) / range * Math.PI)
                      + 1)
                  / 2);
          iconSizes[i].height =
              minimumSize.height
              + Math.round(
                  (maximumSize.height - minimumSize.height - 1)
                  * (
                      Math.cos(
                          (i - index - across + 1) / range * Math.PI)
                      + 1)
                  / 2);
          
          // add the icon size to the current width
          currentWidth += iconSizes[i].width;
          currentHeight += iconSizes[i].height;
          
        }else{
        
          // set the icon size to the appropriate value
          iconSizes[i].width =
              minimumSize.width
              + Math.round(
                  (maximumSize.width - minimumSize.width - 1)
                  * (
                      Math.cos(
                          (i - index - across) / range * Math.PI)
                      + 1)
                  / 2);
          iconSizes[i].height =
              minimumSize.height
              + Math.round(
                  (maximumSize.height - minimumSize.height - 1)
                  * (
                      Math.cos(
                          (i - index - across) / range * Math.PI)
                      + 1)
                  / 2);
          
          // add the icon size to the current width
          currentWidth += iconSizes[i].width;
          currentHeight += iconSizes[i].height;
          
        }
        
       
      }
      
      // update the maximum width if necessary
      if (currentWidth > maximumWidth) maximumWidth = currentWidth;
      if (currentHeight > maximumHeight) maximumHeight = currentHeight;
      
      // detect if the total size should be corrected
      if (index >= range
          && index < iconSizes.length - range
          && currentWidth < maximumWidth){

        // correct the size of the smallest magnified icons
        iconSizes[index - range].width += Math.floor((maximumWidth - currentWidth) / 2);
        iconSizes[index - range].height += Math.floor((maximumHeight - currentHeight) / 2);
        
        iconSizes[index + range].width += Math.ceil((maximumWidth - currentWidth) / 2);
        iconSizes[index + range].height += Math.ceil((maximumHeight - currentHeight) / 2);
      }
      
      // update the sizes of the images
      for (var i = 0; i < iconNodes.length; i++) updateIconProperties(i);
      
    }

    
  }

  // Processes a mouseout event on an image in the dock.
  function processMouseOut(){
  
    // check that neither the closing interval nor time-out are set
    if (!closeTimeout && !closeInterval){
    
      // create the closing time-out
      closeTimeout = window.setTimeout(
          function(){
            closeTimeout = null;
            if (openInterval){
              window.clearInterval(openInterval);
              openInterval = null;
            }
            closeInterval = window.setInterval(
                function(){
                  if (scale > 0) scale -= 0.125;
                  if (scale <= 0){
                    scale = 0;
                    window.clearInterval(closeInterval);
                    closeInterval = null;
                  }
                  for (var i = 0; i < iconNodes.length; i++){
                    updateIconProperties(i);
                  }
                },
                20);
          },
          100);
          
    }
    
  }

}
