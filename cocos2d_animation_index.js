$(document).ready(function(){
    init()
//    initBaseScene();
});

function initBaseScene(){
//    cc.game.onStart = function(){
//        if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
//            document.body.removeChild(document.getElementById("cocosLoading"));
//
//        cc.view.enableRetina(false);
//        cc.view.adjustViewPort(true);
//        cc.view.setDesignResolutionSize(1080, 720);
//        cc.director.runScene(new BackgroundScene());
//
//    };
//    cc.game.run();
    cc.game.onStart = function(){
        if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
            document.body.removeChild(document.getElementById("cocosLoading"));

        // Pass true to enable retina display, disabled by default to improve performance
        cc.view.enableRetina(false);
        // Adjust viewport meta
        cc.view.adjustViewPort(true);
        // Setup the resolution policy and design resolution size
        cc.view.setDesignResolutionSize(720, 720);
        // The game will be resized when browser size change
        // cc.view.resizeWithBrowserSize(true);
        //load resources
        ResourceList();
        cc.LoaderScene.preload(window.resources, function () {
            cc.director.runScene(new SpriteScene());
        }, this);
    };
    cc.game.run();
}


function ResourceList(){
//    var resource_id = $("#select_sprite").val();
    window.resources = [
        "assets/web_0011.ExportJson",
        "assets/web_00111.plist",
        "assets/web_00111.png",
        "assets/web_00110.plist",
        "assets/web_00110.png"];
//    window.resources = [ "assets/mini_100100_r.ExportJson",
//        "assets/mini_100100_r0.plist",
//        "assets/mini_100100_r0.png"];
}


function init(){
    fetch('./output.json')
    .then((response) => response.json())
    .then((json) => add_dir(json));
}

function add_dir(json){
    let stringFile = "<option value=''>-</option>";
    for(let i in json){
        stringFile+="<option value=\"" + i + "\">" + i + "</option>";
    }
     $("#select_dir").html(stringFile);
}

function add_dir2(json){
    let dir = $("#select_dir").val()
    let stringFile = "<option value=''>-</option>";
    for(let i in json[dir]){
        stringFile+="<option value=\"" + i + "\">" + i + "</option>";
    }
     $("#select_dir2").html(stringFile);
}
function add_animation(json){
    let dir = $("#select_dir").val()
    let dir2 = $("#select_dir2").val()
    let stringFile = "<option value=''>-</option>";
    for(let i in json[dir][dir2]){
        stringFile+="<option value=\"" + i + "\">" + i + "</option>";
    }
     $("#select_animation").html(stringFile);
}
function add_action(json){
    let dir = $("#select_dir").val()
    let dir2 = $("#select_dir2").val()
    let animation = $("#select_animation").val()
    let stringFile = "";
//    console.log(json[dir][dir2][animation]["mov_data"].length)
    for(let i=0; i<json[dir][dir2][animation]["mov_data"].length;i++){
//        console.log(i)
        stringFile+="<option value=\"" + i + "\">" + json[dir][dir2][animation]["mov_data"][i] + "</option>";
    }
     $("#select_action").html(stringFile);
     play_animation(json)
}
function startScene(){
    cc.game.onStart = function(){
        // Pass true to enable retina display, disabled by default to improve performance
        cc.view.enableRetina(false);
        // Adjust viewport meta
        cc.view.adjustViewPort(true);
        // Setup the resolution policy and design resolution size
        cc.view.setDesignResolutionSize(720, 720);
        // The game will be resized when browser size change
        // cc.view.resizeWithBrowserSize(true);
        //load resources
        cc.LoaderScene.preload(window.resources, function () {
            cc.director.runScene(new SpriteScene());
        }, this);
    };
    cc.game.run();
}

function play_animation(json){
    let dir = $("#select_dir").val()
    let dir2 = $("#select_dir2").val()
    let animation = $("#select_animation").val()
    info = json[dir][dir2][animation]
    let new_res = [info["base"]+"/"+animation]
    for(let i=0;i<info["plist_l"].length;i++){
        new_res.push(info["base"]+"/"+info["plist_l"][i])
    }
    for(let i=0;i<info["png_l"].length;i++){
        new_res.push(info["base"]+"/"+info["png_l"][i])
    }
//    console.log(new_res)
    window.resources = new_res;
    startScene()
}
$("#select_dir").change(function(){
    fetch('./output.json')
    .then((response) => response.json())
    .then((json) => add_dir2(json));
})

$("#select_dir2").change(function(){
    fetch('./output.json')
    .then((response) => response.json())
    .then((json) => add_animation(json));
})
$("#select_animation").change(function(){
    fetch('./output.json')
    .then((response) => response.json())
    .then((json) => add_action(json));
})
