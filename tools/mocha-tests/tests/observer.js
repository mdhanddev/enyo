describe ("Observer", function () {
	describe ("methods", function () {
		describe ("#addObserver", function () {
			var obj = new enyo.Object();
		
			after (function () {
				obj.destroy();
			});
		
			it ("should respond to addObserver", function () {
				expect(obj).to.respondTo("addObserver");
			});
		
			it ("should add an observer", function () {
				obj.addObserver("testprop", function () {});
				expect(obj.observers()).to.be.an("array");
				expect(obj.observers()).to.have.length(1);
			});
		});
		
		describe ("#observe", function () {
			var obj = new enyo.Object();
			
			after (function () {
				obj.destroy();
			});
			
			it ("should respond to observe", function () {
				expect(obj).to.respondTo("observe");
			});
			
			it ("should add an observer", function () {
				obj.observe("testprop", function () {});
				expect(obj.observers()).to.be.an("array");
				expect(obj.observers()).to.have.length(1);
			});
		});
		
		describe ("#removeObserver", function () {
			var obj = new enyo.Object();
			
			after (function () {
				obj.destroy();
			});
			
			it ("should respond to removeObserver", function () {
				expect(obj).to.respondTo("removeObserver");
			});
			
			it ("should remove an observer", function () {
				var fn = function () {};
				obj.observe("testprop", fn);
				expect(obj.observers()).to.have.length(1);
				obj.removeObserver("testprop", fn);
				expect(obj.observers()).to.be.empty;
			})
		});
		
		describe ("#unobserve", function () {
			var obj = new enyo.Object();
			
			after (function () {
				obj.destroy();
			});
		
			it ("should respond to unobserve", function () {
				expect(obj).to.respondTo("unobserve");
			});
			
			it ("should remove an observer", function () {
				var fn = function () {};
				obj.observe("testprop", fn);
				expect(obj.observers()).to.have.length(1);
				obj.unobserve("testprop", fn);
				expect(obj.observers()).to.be.empty;
			})
		});
		
		describe ("#notifyObservers", function () {
			var obj = new enyo.Object();
			
			after (function () {
				obj.destroy();
			});
		
			it ("should respond to notifyObservers", function () {
				expect(obj).to.respondTo("notifyObservers");
			});
			
			it ("should trigger observers for the given property", function (done) {
				obj.observe("testprop", function () {
					done();
				});
				
				obj.notifyObservers("testprop");
			});
		});
		
		describe ("#notify", function () {
			var obj = new enyo.Object();
			
			after (function () {
				obj.destroy();
			});
		
			it ("should respond to notify", function () {
				expect(obj).to.respondTo("notify");
			});
			
			it ("should trigger observers for the given property", function (done) {
				obj.observe("testprop", function () {
					done();
				});
				
				obj.notify("testprop");
			});
		});
		
		describe ("#stopNotifications", function () {
			var obj
			
			beforeEach (function () {
				obj = new enyo.Object();
			});
			
			afterEach (function () {
				obj.destroy();
			});
			
			it ("should respond to stopNotifications", function () {
				expect(obj).to.respondTo("stopNotifications");
			});
			
			it ("should stop propagation of changes", function () {
				obj.observe("testprop", function () {
					throw new Error("should not execute observer");
				});
				obj.stopNotifications();
				obj.set("testprop", true);
				expect(obj._observeCount).to.equal(1);
			});
			
			it ("should automatically queue changes while not observing", function (done) {
				obj.observe("testprop", function (was, is) {
					expect(was).to.be.true;
					expect(is).to.be.false;
					done();
				});
				
				obj.stopNotifications();
				obj.set("testprop", true);
				obj.set("testprop", false);
				obj.startNotifications();
			});
			
			it ("should not queue changes if called with noQueue true", function () {
				obj.observe("testprop", function () {
					throw new Error("should not execute observer");
				});
				
				obj.stopNotifications(true);
				obj.set("testprop", true);
				obj.set("testprop", false);
				obj.startNotifications();
			});
		});
		
		describe ("#startNotifications", function () {
			var obj;
			
			beforeEach (function () {
				obj = new enyo.Object();
			});
			
			afterEach (function () {
				obj.destroy();
			});
			
			it ("should respond to startNotifications", function () {
				expect(obj).to.respondTo("startNotifications");
			});
			
			it ("should do nothing if notifications were not stopped", function () {
				obj.startNotifications();
				expect(obj._observeCount).to.equal(0);
			});
			
			it ("should automatically flush any queued results", function (done) {
				obj.observe("testprop", function (was, is) {
					expect(was).to.be.true;
					expect(is).to.be.false;
					done();
				});
				
				obj.stopNotifications();
				obj.set("testprop", true);
				obj.set("testprop", false);
				obj.startNotifications();
				expect(obj._observeCount).to.equal(0);
			});
			
			it ("should re-enable a disabled notification queue with queue true", function () {
				obj.observe("testprop", function (was, is) {
					expect(was).to.be.false;
					expect(is).to.be.true;
				});
				
				obj.stopNotifications(true);
				expect(obj._notificationQueueEnabled).to.be.false;
				obj.set("testprop", true);
				obj.set("testprop", false);
				obj.startNotifications(true);
				expect(obj.testprop).to.be.false;
				expect(obj._notificationQueueEnabled).to.be.true;
				obj.stopNotifications();
				obj.set("testprop", true);
				obj.startNotifications();
			});
		});
		
		describe ("#isObserving", function () {
			var obj = new enyo.Object();
			
			after (function () {
				obj.destroy();
			});
			
			it ("should respond to isObserving", function () {
				expect(obj).to.respondTo("isObserving");
			});
			
			it ("should indicate if an object is actively observing changes", function () {
				expect(obj.isObserving()).to.be.true;
			});
			
			it ("should indicate if an object is not actively observing changes", function () {
				obj.stopNotifications();
				expect(obj.isObserving()).to.be.false;
			});
		});
		
		describe ("#enableNotificationQueue", function () {
			var obj = new enyo.Object();
			
			after (function () {
				obj.destroy();
			});
			
			it ("should respond to enableNotificationQueue", function () {
				expect(obj).to.respondTo("enableNotificationQueue");
			});
			
			it ("should re-enable a disabled notification queue", function () {
				obj._notificationQueueEnabled = false;
				obj.enableNotificationQueue();
				expect(obj._notificationQueueEnabled).to.be.true;
			});
		});
		
		describe ("#disableNotificationQueue", function () {
			var obj = new enyo.Object();
			
			after (function () {
				obj.destroy();
			});
			
			it ("should respond to disableNotificationQueue", function () {
				expect(obj).to.respondTo("disableNotificationQueue");
			});
			
			it ("should disable an enabled notification queue", function () {
				expect(obj._notificationQueueEnabled).to.be.true;
				obj.disableNotificationQueue();
				expect(obj._notificationQueueEnabled).to.be.false;
			});
		});
		
		describe ("#removeAllObservers", function () {
			var obj = new enyo.Object();
			
			after (function () {
				obj.destroy();
			});
			
			it ("should respond to removeAllObservers", function () {
				expect(obj).to.respondTo("removeAllObservers");
			});
			
			it ("should remove any observers for a given instance", function () {
				obj.observe("testprop", function () {
					throw new Error("should not trigger observer");
				});
				
				obj.removeAllObservers();
				expect(obj.observers()).to.be.empty;
			});
		})
	});
	
	describe ("declarative observers", function () {
		describe ("array syntax", function () {
			var ctor, obj;
			
			ctor = enyo.kind({
				testObserver1: function (was, is, prop) {
					throw new Error("testObserver1" + prop);
				},
				testObserver2: function (was, is, prop) {
					throw new Error("testObserver2" + prop);
				},
				observers: [
					{method: "testObserver1", path: "testprop1"},
					{method: "testObserver1", path: "testprop2"},
					{method: "testObserver2", path: ["testprop1", "testprop3", "testprop4"]}
				]
			});
			
			beforeEach (function () {
				obj = new ctor();
			});
			
			afterEach (function () {
				obj.destroy();
			})
			
			it ("should be able to declare observers as an array", function () {
				expect(ctor.prototype.kindObservers).to.exist;
				expect(ctor.prototype.kindObservers).to.be.an("array");
				expect(ctor.prototype.kindObservers).to.have.length(5);
				expect(obj.observers()).to.be.an("array");
				expect(obj.observers()).to.have.length(5);
			});
			
			it ("should be able to declare multiple dependent properties for the same observer method", function () {
				expect(obj.observers("testprop1")).to.have.length(2);
			});
			
			it ("should be able to declare multiple dependent properties in an array", function () {
				var fn = obj.testObserver2;
				expect(enyo.filter(obj.observers(), function (ln) {
					return ln.method === fn;
				})).to.have.length(3);
			});
			
			it ("should respond properly to change notifications", function () {
				var fn1, fn2;
				
				fn1 = function () {
					obj.set("testprop2", true);
				};
				
				fn2 = function () {
					obj.set("testprop4", true);
				};
				
				expect(fn1).to.throw("testObserver1testprop2");
				expect(fn2).to.throw("testObserver2testprop4");
			});
		});
		
		describe ("object literal syntax (deprecated)", function () {
			var ctor, obj;
			
			ctor = enyo.kind({
				testObserver1: function (was, is, prop) {
					throw new Error("testObserver1" + prop);
				},
				testObserver2: function (was, is, prop) {
					throw new Error("testObserver2" + prop);
				},
				observers: {
					testObserver1: ["testprop1", "testprop2"],
					testObserver2: ["testprop1", "testprop3", "testprop4"]
				}
			});
			
			beforeEach (function () {
				obj = new ctor();
			});
			
			afterEach (function () {
				obj.destroy();
			});
			
			it ("should be able to declare observers as an object literal", function () {
				expect(ctor.prototype.kindObservers).to.exist;
				expect(ctor.prototype.kindObservers).to.be.an("array");
				expect(ctor.prototype.kindObservers).to.have.length(5);
				expect(obj.observers()).to.be.an("array");
				expect(obj.observers()).to.have.length(5);
			});
			
			it ("should be able to declare the same dependent property for multiple observer methods", function () {
				expect(obj.observers("testprop1")).to.have.length(2);
			});
			
			it ("should be able to declare multiple dependent properties in an array", function () {
				var fn = obj.testObserver2;
				expect(enyo.filter(obj.observers(), function (ln) {
					return ln.method === fn;
				})).to.have.length(3);
			});
			
			it ("should respond properly to change notifications", function () {
				var fn1, fn2;
				
				fn1 = function () {
					obj.set("testprop2", true);
				};
				
				fn2 = function () {
					obj.set("testprop4", true);
				};
				
				expect(fn1).to.throw("testObserver1testprop2");
				expect(fn2).to.throw("testObserver2testprop4");
			});
		});
	});
	
	// describe ("path support", function () {
	// 	var ctor;
	// 	
	// 	ctor = enyo.kind({
	// 		chainObserver: function (was, is, prop) {
	// 			throw new Error(prop);
	// 		},
	// 		observers: [
	// 			{method: "chainObserver", path: "some.nested.property"}
	// 		],
	// 		create: function () {
	// 			this.inherited(arguments);
	// 			this.set("some", )
	// 		}
	// 	});
	// 	
	// });
});