$(document).ready(function () {

	var today = new Date()
		var curHr = today.getHours()

		if (curHr < 12) {
			$("#spnWish").html('Good Morning');
		} else if (curHr < 18) {
			$("#spnWish").html('Good Afternoon');
		} else {
			$("#spnWish").html('Good Evening');
		}

		var items = ["m", "n", "o", "p", "q","r","s"];
	var item = items[Math.floor(Math.random() * items.length)];
	//document.getElementById("mainDv").style.backgroundImage = 'url(' + item + '.jpg)';
	$("#mainDv").css("background", 'url(statics/images/' + item + '.jpg) no-repeat center fixed');
	
	$("h1").click(function () {
		localStorage["inputText"] = "Welcome Mayur patel";
	});
	//alert(localStorage["inputText"]);
	startTime();

	SetName();

	//To DO block
	$("#btnAddToDo").on("click", function () {
		$("#dvToDo").slideDown('slow').promise()
		.done(function () {
			$("#txtToDo").focus();
		});

	});
	$("#btnCancleTodo").on("click", function () {
		$("#dvToDo").slideUp('slow');
	});
	$("#btnSaveToDo").on("click", function () {
		if ($("#txtToDo").val() != "") {
			var todo_list = [];
			chrome.storage.local.get("stored_todo_list", function (data) {
				todo_list = data.stored_todo_list;
				
				if (todo_list == undefined || todo_list == "undefined" || todo_list == null || todo_list == "") {
					todo_list = [];
				}
				
				var html = $("#txtToDo").val();
				var div = document.createElement("div");
				div.innerHTML = html;
				var text = div.textContent || div.innerText || "";
				
				todo_list.push(text);
				chrome.storage.local.set({
					'stored_todo_list' : todo_list
				}, function () {
					$("#txtToDo").val("");
					$("#txtToDo").focus();
					HandleToDos();
				});
			});
		}
	});

	HandleToDos();

	var queryString = 'http://api.openweathermap.org/data/2.5/find?q=' + google.loader.ClientLocation.address.city + '&type=like&sort=population&cnt=30';
	$.getJSON(queryString, function (results) {
		var num = results.list[0].main.temp - 273.15;
		var we = num.toFixed(2);
		$("#spWeather").html(we + "&nbsp  &#8451;<br/>" + google.loader.ClientLocation.address.city);
		$("#spWeather").css('visibility', 'visible');
	});

});

function startTime() {
	var today = new Date();
	var h = today.getHours();
	var m = today.getMinutes();
	var s = today.getSeconds();
	m = checkTime(m);
	s = checkTime(s);
	document.getElementById('txtTime').innerHTML =
		h + ":" + m + ":" + s;
	var t = setTimeout(startTime, 500);
}
function checkTime(i) {
	if (i < 10) {
		i = "0" + i
	}; // add zero in front of numbers < 10
	return i;
}

function SetName() {
	var name_user = localStorage["name_user"];
	if (name_user != "undefined" && name_user != undefined && name_user != "") {
		$("#txtName").val(name_user);
	}

	$("#txtName").on("blur", function () {
		//alert($(this).val());
		//alert("Name saved");
		if ($(this).val() != "") {
			localStorage["name_user"] = $(this).val();
			NotifySaveName($(this).val());
		}
	});
}
function NotifySaveName(name) {
	var detailObj = {
		type : "basic",
		title : "Bellow name saved",
		message : name,
		iconUrl : "notification.png"
	}
	chrome.notifications.create(detailObj);
}

function HandleToDos() {
	var todo_list = [];
	chrome.storage.local.get("stored_todo_list", function (data) {
		todo_list = data.stored_todo_list;
		if (todo_list.length == undefined || todo_list.length == "undefined" || todo_list.length == 0) {
			//NO RECORSD FOUND DIV...
			$("#ul_todo").empty();
		} else {
			var cnt = 1;
			$("#ul_todo").empty();
			for (var i = todo_list.length - 1; i >= 0; i--) {
				//alert(todo_list[i]);
				var li_todo = '<li>' +
					'<span>' +
					'<div class="pull-right"><b id="removetodo_' + cnt + '" class="close_todo">X</b></div>' +
					'<p style="border-bottom:1px solid black">#' + cnt + '</p>' +
					'<p id="blNotes_' + cnt + '" style="white-space:normal;">' + todo_list[i] + '</p>' +
					'</span>' +
					'</li>';
				cnt++;
				$("#ul_todo").append(li_todo);
			}
			$("[id^=removetodo_]").click(function () {
				var id_remove = $(this).attr("id").split("_")[1];
				var remove_from_todo = $("#blNotes_" + id_remove).text();

				var todo_list = [];
				chrome.storage.local.get("stored_todo_list", function (data) {
					todo_list = data.stored_todo_list;

					var index = todo_list.indexOf(remove_from_todo);
					if (index > -1) {
						todo_list.splice(index, 1);
					}
					chrome.storage.local.set({
						'stored_todo_list' : todo_list
					}, function () {
						HandleToDos();
					});
				});
			});
		}
	});
}
