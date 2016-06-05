var myApp ={};
myApp.init = function(){
    // Instance the DB
    myApp.db =new PouchDB('todos');
    // Init the todo App
    myApp.todo.init();
};

$(window).load(myApp.init);

// Load Template
myApp.loadTemplate = function(view, data, target){
    var swig =require('swig'),
    fileName = 'view/' + view + '.html';
    var template = swig.renderFile(fileName, data || {});
    if (target) return $(target).html(template);
    return template;
};

// Remove element from the DOM after slideUp
myApp.removeFromGUI = function($items){
    $items.slideUp(200,function(){
        $(this).remove();
    });
};

// Autoresize textarea on add/delete content
myApp.resizeTextarea = function($ta){
    $ta.height(20).height($ta.prop("scrollHeight"));
};
