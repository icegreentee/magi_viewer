let char_id = "1001"
let custom_index =0
let customs=[]
let last_canvas_data=null
let current_chara= "1001"
let current_chara_rank= 1
let fav_char_id="1502"
let fav_char_rank=4

var desin_data={
    "width":1707,
    "height":910,
    "live2d_w":765,
    "live2d_h":908.44,
    "right_area_w":100,
	"right_area_h":462.37,
	"char_left_w":320,
	"char_left_h":485.07,
	"char_card_w":400,
	"char_card_h":607.35,
}
$(document).ready(function(){
    adjust_page();
	loadLive2d();
});

$(window).resize( function  () {
	adjust_page();
})


function loadLive2d(){
	init(1280,1520);
	fetchLocal("./jsons/list.json").then(r => r.json(), alert)
	.then(list => {
	    customs = Object.keys(list[fav_char_id])
	    let lastChild = null;
		custom_index =0
	    show_live2d()
	$("#change_custom").unbind("click")
	$("#change_custom").click(function(){
	    custom_index+=1
	    custom_index=custom_index%customs.length
	    show_live2d()
	})
	});
}

function fetchLocal(url, data) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest
    xhr.onload = function() {
      resolve(new Response(xhr.responseText, {status: xhr.status}))
    }
    xhr.onerror = function() {
      reject(new TypeError('Local request failed'))
    }
    xhr.open('GET', url)
    xhr.send(data)
  })
}


function adjust_page(){
    let current_w = document.documentElement.clientWidth;
    let current_h =  document.documentElement.clientHeight;
	console.log(current_w,current_h)
    // let per= current_h/desin_data["height"]
    $("#left_area").width(desin_data["right_area_w"]/desin_data["right_area_h"]*current_h*0.7)
    $("#right_area").width(desin_data["right_area_w"]/desin_data["right_area_h"]*current_h)
    $("#canvas").width(desin_data["live2d_w"]/desin_data["live2d_h"]*current_h)

    let useful_space=$("#right_area_extra").offset().left-$("#left_area").width()
    let star_p=(useful_space-$("#canvas").width())/2
    // console.log(useful_space,$("#canvas").width(),star_p)
    // console.log(star_p+$("#left_area").width()+"px")
    $("#canvas").css("left",star_p+$("#left_area").width()+"px");
	if(last_canvas_data){
		if(last_canvas_data["w"]!=current_w || last_canvas_data["h"]!=current_h){
			startScene("main")
		}
	}else{
		startScene("main")
	}
	last_canvas_data={"w":current_w,"h":current_h}
	
	// char
	$("#char_left").width(current_h*0.6*desin_data["char_left_w"]/desin_data["char_left_h"])
	$("#char_card").width(current_h*0.76*desin_data["char_card_w"]/desin_data["char_card_h"])
	$(".chara_head").width(current_h*0.2*0.75)
	$(".chara_head").height(current_h*0.2*0.75)
	$(".chara_rank").width($("#char_left").width()*0.3)
	$(".chara_rank").height($("#char_left").width()*0.3)
}

function show_live2d(){
    let lastChild = null;
    while (lastChild = app.stage.children.shift()) { lastChild.destroy(); }
    show("./image_native/live2d_v4/"+customs[custom_index]+"/", "model.model3.json", function(model) {
        });
}


function startScene(res_n){
    cc.game.onStart = function(){
        // Pass true to enable retina display, disabled by default to improve performance
        cc.view.enableRetina(false);
        // Adjust viewport meta
        cc.view.adjustViewPort(true);
        // Setup the resolution policy and design resolution size
        cc.view.setDesignResolutionSize(1024, 768,4);
        // The game will be resized when browser size change
        // cc.view.resizeWithBrowserSize(true);
        //load resources
        cc.LoaderScene.preload(pre_res, function () {
			main_page()
			// char_page()
        }, this);
    };
    cc.game.run();
}
function gen_chara(i,attr,rank){
	let add_div="<div class='chara_head' id='char_head_"+i+"'>"
	add_div+="<img src='./image_native/card/frame/bg_"+attr+".png' class='chara_head_1'/>"
	add_div+="<img src='./image_native/card/image/card_"+i+rank+"_f.png' class='chara_head_2'/>"
	add_div+="<img src='./image_native/card/frame/frame_rank_"+rank+".png' class='chara_head_3'/>"
	add_div+="<img src='./image_native/card/frame/att_"+attr+".png' class='chara_head_4'/>"
	add_div+="<img src='./image_web/common/chara/icon_select.png' id='char_head_"+i+"_select' class='chara_head_5'/>"
	add_div+="</div>"
	return add_div
}

function add_chara_list(){
	$("#chara_head_list").empty();
	current_chara= "1001"
	current_chara_rank= 1
	for(let i in chara_data){
		$("#chara_head_list").append(gen_chara(i,chara_data[i]["attr"].toLowerCase(),chara_data[i]["defaultRank"]))
		$("#char_head_"+i).on("click",function(){
			if(i!=current_chara){
				$("#char_head_"+current_chara+"_select").css("display","none");
				$("#char_head_"+i+"_select").css("display","block");
				current_chara=i;
				window.mini_res="./image_native/mini/anime_v2/mini_"+current_chara+"00_r.ExportJson"
				window.mini_name="mini_"+current_chara+"00_r"
				let nowScene = cc.director.getRunningScene()
				nowScene.removeChildByTag(1)
				nowScene.addChild(new charaLayer(),0,1)
				char_left_load()
				$("#char_card_c").attr("src","./image_native/card/image/card_"+current_chara+chara_data[current_chara]["defaultRank"]+"_c.png")
				$("#char_card_f").attr("src","./image_native/card/frame/frame_"+chara_data[current_chara]["attr"].toLowerCase()+"_rank_"+chara_data[current_chara]["defaultRank"]+".png")
				if(fav_char_id==current_chara){
					$("#favorite_set").attr("src","./image_web/page/chara/conf_leader_on.png");
				}else{
					$("#favorite_set").attr("src","./image_web/page/chara/conf_leader_off.png");
				}
				$("#char_card_c").attr("src","./image_native/card/image/card_"+current_chara+current_chara_rank+"_c.png")
				$("#char_card_f").attr("src","./image_native/card/frame/frame_"+chara_data[current_chara]["attr"].toLowerCase()+"_rank_"+current_chara_rank+".png")
			}	
		})
	}
	$(".chara_head").width(document.documentElement.clientHeight*0.2*0.75)
	$(".chara_head").height(document.documentElement.clientHeight*0.2*0.75)
}
function char_left_load(){
	$("#chara_name").text(chara_data[current_chara]["cn"])
	$("#chara_attr").attr("src","./image_web/common/chara/att_"+chara_data[current_chara]["attr"].toLowerCase()+"_f.png")
	let d_rank=chara_data[current_chara]["defaultRank"]
	let m_rank=chara_data[current_chara]["maxRank"]
	for(let i=1;i<=5;i++){
		if(i>=d_rank&&i<=m_rank){
			$("#chara_rank"+i).show()
		}else{
			$("#chara_rank"+i).hide()
		}
	}
	
	$("#chara_rank1_attr_bg").attr("src","./image_native/card/frame/bg_"+chara_data[current_chara]["attr"].toLowerCase()+".png")
	$("#chara_rank2_attr_bg").attr("src","./image_native/card/frame/bg_"+chara_data[current_chara]["attr"].toLowerCase()+".png")
	$("#chara_rank3_attr_bg").attr("src","./image_native/card/frame/bg_"+chara_data[current_chara]["attr"].toLowerCase()+".png")
	$("#chara_rank4_attr_bg").attr("src","./image_native/card/frame/bg_"+chara_data[current_chara]["attr"].toLowerCase()+".png")
	$("#chara_rank5_attr_bg").attr("src","./image_native/card/frame/bg_"+chara_data[current_chara]["attr"].toLowerCase()+".png")
	
	$("#chara_rank1_attr").attr("src","./image_native/card/frame/att_"+chara_data[current_chara]["attr"].toLowerCase()+".png")
	$("#chara_rank2_attr").attr("src","./image_native/card/frame/att_"+chara_data[current_chara]["attr"].toLowerCase()+".png")
	$("#chara_rank3_attr").attr("src","./image_native/card/frame/att_"+chara_data[current_chara]["attr"].toLowerCase()+".png")
	$("#chara_rank4_attr").attr("src","./image_native/card/frame/att_"+chara_data[current_chara]["attr"].toLowerCase()+".png")
	$("#chara_rank5_attr").attr("src","./image_native/card/frame/att_"+chara_data[current_chara]["attr"].toLowerCase()+".png")
	
	$("#chara_rank1_head").attr("src","./image_native/card/image/card_"+current_chara+"1_f.png")
	$("#chara_rank2_head").attr("src","./image_native/card/image/card_"+current_chara+"2_f.png")
	$("#chara_rank3_head").attr("src","./image_native/card/image/card_"+current_chara+"3_f.png")
	$("#chara_rank4_head").attr("src","./image_native/card/image/card_"+current_chara+"4_f.png")
	$("#chara_rank5_head").attr("src","./image_native/card/image/card_"+current_chara+"5_f.png")
	$("#chara_rank1_select").hide()
	$("#chara_rank2_select").hide()
	$("#chara_rank3_select").hide()
	$("#chara_rank4_select").hide()
	$("#chara_rank5_select").hide()
	if(fav_char_id==current_chara){
		$("#favorite_set").attr("src","./image_web/page/chara/conf_leader_on.png");
		current_chara_rank=fav_char_rank
	}else{
		$("#favorite_set").attr("src","./image_web/page/chara/conf_leader_off.png");
		current_chara_rank=chara_data[current_chara]["defaultRank"]
	}
	$("#chara_rank"+current_chara_rank+"_select").show()
}

function char_page(){
	add_chara_list()
	char_left_load()
	$("#char_head_"+current_chara+"_select").css("display","block")
	$("#char_card_c").attr("src","./image_native/card/image/card_"+current_chara+current_chara_rank+"_c.png")
	$("#char_card_f").attr("src","./image_native/card/frame/frame_"+chara_data[current_chara]["attr"].toLowerCase()+"_rank_"+current_chara_rank+".png")
	$(".main").hide()
	$(".char").show()
	window.mini_res="./image_native/mini/anime_v2/mini_100100_r.ExportJson"
	window.mini_name="mini_100100_r"
	window.bg_res="./package/bg/web_common.ExportJson"
	window.bg_name="web_common"
	cc.director.runScene(new cc.TransitionFade(0.2,new charaScene()));
}

function main_page(){
	$("#chara_avater").attr('src', './image_native/card/image/card_'+fav_char_id+fav_char_rank+'_f.png');
	$(".char").hide()
	$(".main").show()
	window.bg_res="./image_native/bg/web/web_0011.ExportJson"
	window.bg_name="web_0011"
	cc.director.runScene(new cc.TransitionFade(0.2,new bgScene()));
}

$("#back_main").on("click",function(){
	main_page()
})

$("#menu_char").on("click",function(){
	char_page()
})

$("#chara_rank1").on("click",function(){
	if(current_chara_rank!=1){
		$("#chara_rank"+current_chara_rank+"_select").hide()
		current_chara_rank=1
		$("#chara_rank"+current_chara_rank+"_select").show()
		$("#char_card_c").attr("src","./image_native/card/image/card_"+current_chara+current_chara_rank+"_c.png")
		$("#char_card_f").attr("src","./image_native/card/frame/frame_"+chara_data[current_chara]["attr"].toLowerCase()+"_rank_"+current_chara_rank+".png")
		if(fav_char_id==current_chara){
			fav_char_rank=1
		}
	}
})
$("#chara_rank2").on("click",function(){
	if(current_chara_rank!=2){
		$("#chara_rank"+current_chara_rank+"_select").hide()
		current_chara_rank=2
		$("#chara_rank"+current_chara_rank+"_select").show()
		$("#char_card_c").attr("src","./image_native/card/image/card_"+current_chara+current_chara_rank+"_c.png")
		$("#char_card_f").attr("src","./image_native/card/frame/frame_"+chara_data[current_chara]["attr"].toLowerCase()+"_rank_"+current_chara_rank+".png")
		if(fav_char_id==current_chara){
			fav_char_rank=2
		}
	}
})
$("#chara_rank3").on("click",function(){
	if(current_chara_rank!=3){
		$("#chara_rank"+current_chara_rank+"_select").hide()
		current_chara_rank=3
		$("#chara_rank"+current_chara_rank+"_select").show()
		$("#char_card_c").attr("src","./image_native/card/image/card_"+current_chara+current_chara_rank+"_c.png")
		$("#char_card_f").attr("src","./image_native/card/frame/frame_"+chara_data[current_chara]["attr"].toLowerCase()+"_rank_"+current_chara_rank+".png")
		if(fav_char_id==current_chara){
			fav_char_rank=3
		}
	}
})
$("#chara_rank4").on("click",function(){
	if(current_chara_rank!=4){
		$("#chara_rank"+current_chara_rank+"_select").hide()
		current_chara_rank=4
		$("#chara_rank"+current_chara_rank+"_select").show()
		$("#char_card_c").attr("src","./image_native/card/image/card_"+current_chara+current_chara_rank+"_c.png")
		$("#char_card_f").attr("src","./image_native/card/frame/frame_"+chara_data[current_chara]["attr"].toLowerCase()+"_rank_"+current_chara_rank+".png")
		if(fav_char_id==current_chara){
			fav_char_rank=4
		}
	}
})
$("#chara_rank5").on("click",function(){
	if(current_chara_rank!=5){
		$("#chara_rank"+current_chara_rank+"_select").hide()
		current_chara_rank=5
		$("#chara_rank"+current_chara_rank+"_select").show()
		$("#char_card_c").attr("src","./image_native/card/image/card_"+current_chara+current_chara_rank+"_c.png")
		$("#char_card_f").attr("src","./image_native/card/frame/frame_"+chara_data[current_chara]["attr"].toLowerCase()+"_rank_"+current_chara_rank+".png")
		if(fav_char_id==current_chara){
			fav_char_rank=5
		}
	}
})
$("#favorite_set").on("click",function(){
	if(fav_char_id!=current_chara){
		$("#favorite_set").attr("src","./image_web/page/chara/conf_leader_on.png");
		fav_char_id=current_chara
		fav_char_rank=current_chara_rank
		loadLive2d()
	}
})