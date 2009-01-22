/* OnloadScheduler.js - schedules functions to run when a document has loaded
 *
 * The author of this program, Safalra (Stephen Morley), irrevocably releases
 * all rights to this program, with the intention of it becoming part of the
 * public domain. Because this program is released into the public domain, it
 * comes with no warranty either expressed or implied, to the extent permitted
 * by law.
 *
 * For more public domain JavaScript code by the same author, visit:
 * http://www.safalra.com/programming/javascript/
 */

var OnloadScheduler = new function() {

	var negative = new Array();
	var positive = new Array();

	window.onload = function() {
		for ( var i = negative.length - 1; i > 0; i--)
			execute(negative[i]);
		for ( var i = 0; i < positive.length; i++)
			execute(positive[i]);
		OnloadScheduler = null;
	}

	function execute(tasks) {
		if (tasks) {
			for ( var i = 0; i < tasks.length; i++)
				tasks[i]();
		}
	}

	this.schedule = function(task, priority) {
		if (task instanceof Function) {
			if (!priority)
				priority = 0;
			if (priority < 0) {
				if (negative[-priority]) {
					negative[-priority].push(task);
				} else {
					negative[-priority] = [ task ];
				}
			} else {
				if (positive[priority]) {
					positive[priority].push(task);
				} else {
					positive[priority] = [ task ];
				}
			}
		} else {
			this.schedule( function() {
				eval(task)
			}, priority);
		}
	}

};
