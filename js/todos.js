myApp.todos ={};
myApp.todos.init = function (){
    // Load main application view 
    myApp.loadTemplate('app',null,'#mainView');
    
    // Change todos bg color
    
    myApp.todos.changeBackgroundColor(localStorage.noteColor || '#F8F8FF');
    // Listen for events
    myApp.todos.listenForEvents();
    // Load data from DB
    myApp.todos.loads();
};

myApp.todos.listenForEvents = function () {
    // Add new todo
    $('.add-button').click(function(e) {
        e.preventDefault();
        myApp.todos.addNew();
    });
};
myApp.todos.load = function () {};

myApp.todos.changeBackgroundColor= function( color ) {
    var $customStyle = $('<style/>',{
        html : '#todoListContainer , #todoList li { background: '+ color +';}',
        id : 'customStyle'
        });
        if( $('#customStyle').length> 0){
            $('#customStyle').replaceWith($customStyle);
        } else {
            $customStyle.appendTo('head');
        }
};


myApp.todos.addNew = function(){
    var todo = {
        _id : new Date().toISOString(),
        content: '',
        checked : false
    };
    myApp.db.put(todo ,function callback ( err, result){
        if (err) return console.warn(err);
        todo._rev = result.rev;
        myApp.todos.render(todo,true);
    });
};

myApp.todos.render = function ( todo, focus) {
    
    var todoTemplate = myApp.loadTemplate('todo',todo),
    $todo = $(todoTemplate).prependTo('#todoList'.hide().slideDown(300),
    $content = $todo.find('.todo-content'),
    $check = $todo.find('.todo-check');
    
    myApp.resizeTextarea($content);
    
    // focus on the created todo
    if(focus) $content.focus();
    // -- add event ther --
};

// On check/uncheck item
$check.on('change',function(){
    todo.checked = $(this).is(':checked');
    myApp.todos.update(todo);
    // Disable in check
    if(todo.checked){
        if(localStorage.hideComplated === 'true') myApp.removeFromGUI($todo);
        else
            $content.attr('disabled',true);
    } else {
        $content.romoveAttr('disabled');
    }
});

// On content change
var timer;
$content.on('input',function(){
    myApp.resizeTextarea($content);
    if( typeof timer !== 'undefined') clearTimeout(timer);
    clearTimeout(timer);
    timer = setTimeout(function(){
        todo.content = $content.val();
        myApp.todos.update(todo);
    }, 1000};
});

myApp.todos.update = function(todo){
    myApp.db.put(todo,function callback(err,result){
       if(err) return console.warn(err);
       todo._rev  = result.rev;
    });
};

// On delete item
$todo.find('.delete-button').on('click',function(e){
  e.preventDefault();
  myApp.removeFromGUI($todo);
  myApp.db.remove(todo);
});

myApp.todos.init() = function(){
    myApp.removeFromGUI($('#todoList').find('li'));
    if(localStorage.hideComplated === 'true') myApp.todos.loadUncompleted();
    else myApp.todos.loadAll();
};

myApp.todos.loadAll = function(){
    myApp.db.allDocs({include_docs:true},function(err,resp){
        resp.rows.forEach(function(item)){
            myApp.todos.render(item.doc);
        });
    });
};

myApp.todos.loadUncompleted = function(){
    function map (doc){
        if(doc.checked === false) emit();
    }
    myApp.db.query(map, {include_docs : true},function(err,resp){
        resp.row.forEach(function(item){
            myApp.todos.render(item.doc);
        });
    });
};

    
// Export data 
$('#fileDialog').on('change',function(){
    myApp.todos.export($(this).val());
    $(this).val(''); // Reset the value
});

myApp.todos.export = function( path){
    var fs = require('fs'), data =[],jsonData;
    myApp.db.allDocs({includes_docs:true},function(err,resp){
        resp.rows.forEach(function(item)){
            var newItem = {
                content:item.doc.content,
                completed:item.doc.checked
            };
            data.push(newItem);
            
        });
        fs,writeFile(path,JSON.stringify(data,null,2),function(err){
            if(err) return alert(err);
        });
    });
};

myApp.todos.sync = function(){
    if(!navigator.onLine) return alert('No internet connection available');
    $('#syncing').show();
    PouchDB.sync('todos',localStorage.couchDbUrl).on('complete',function(info){
        myApp.todos.load();
        $('#syncing').fadeOut();
    }).on('error',function(err){
        alert(err);
        $('syncing').fadeOut();
    });
};































