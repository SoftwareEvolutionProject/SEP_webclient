//calle
//Returns an array [[ID, FileInPath], ...] containing the steps necessary to reach root from 'startID'
function findPathToRoot(startID, inputFileSystem) {
	var currFile = inputFileSystem[startID];
	var path = [
		[startID, currFile]
	];
	while (currFile["parent"] != null) {
		var nextID = currFile["parent"];
		currFile = inputFileSystem[nextID];
		path.unshift([nextID, currFile]);
	}
	return path;
}
//Draws the breadcrumb with the given path. INPUT FORMAT: [[RootID, RootFile], ... , [LastID, LastFile]]
function RenderBreadCrumbPath(id) {
	var holder = $("#breadcrumb");
	$(holder).empty();
	breadcrumbs = [];
	var currentFolder = id;
	while (currentFolder != ROOT) {
		var breadcrumb = el("div", {
			"class": "custom-breadcrumb btn btn-xs non-root-crumb",
			"data-id": currentFolder
		});
		var span = el("span", {
			html: filesystem[currentFolder].name
		});
		breadcrumb.appendChild(span);
		breadcrumb.oncontextmenu = function(e) {
			console.log(this);
			MoveDropdownItemsToElement(this);
			e.preventDefault();
		}
		breadcrumbs.unshift(breadcrumb);
		currentFolder = getParent(currentFolder).id;
	}
	//Remove the root
	//breadcrumbs.shift();
	$.each(breadcrumbs, function(key, value) {
		holder.append(value);
	});
}

function MoveDropdownItemsToElement(inputElement) {
	createDropdownMenu(inputElement);
	var rect = inputElement.getBoundingClientRect();
	var recycledDropdown = document.getElementById('breadcrumb-dropdown');
	recycledDropdown.style.left = (rect.left) + "px";
	recycledDropdown.style.top = (rect.bottom) + "px";
	if (recycledDropdown.childElementCount > 0) recycledDropdown.style.display = "block";
	else recycledDropdown.style.display = "none";
}

function createDropdownMenu(elem) {
	var id = elem.getAttribute('data-id');
	var newElem = [];
	$.each(getChildren(id), function(key, value) {
		if (value.type != "folder") {
			return;
		}
		var listTag = el("li", {
			"class": "dropdown-element",
			"data-id": value.id
		});
		var tag = el("a", {
			"href": "#",
			html: value.name
		});
		listTag.appendChild(tag);
		newElem.push(listTag);
	});
	var holder = $("#breadcrumb-dropdown");
	$(holder).empty();
	$.each(newElem, function(key, value) {
		holder.append(value);
	});
}

function HideDropdownElement() {
	var recycledDropdown = document.getElementById('breadcrumb-dropdown');
	recycledDropdown.style.display = "none";
}

function CreateSearchCrumb(searchTerm) {
	var holder = $("#breadcrumb");
	$(holder).empty();
	var breadcrumb = el("div", {
		"class": "custom-breadcrumb btn btn-xs non-root-crumb",
		"data-id": ROOT
	});
	var span = el("span", {
		html: "\"" + searchTerm + "\""
	});
	breadcrumb.appendChild(span);
	holder.append(breadcrumb);
}
$(document).ready(function() {
	$(document).click(function() {
		HideDropdownElement();
	});
	//navtree is clicked
	$("#fileview").on("click", ".selectable", function(e) {
		var dataId = this.getAttribute("data-id");
		setFolder(dataId);
	});
	//root folder is clicked
	$("#root-nav").on("click", function() {
		setFolder(ROOT);
	});
	//root folder is clicked
	$("#breadcrumb").on("click", ".non-root-crumb", function() {
		setFolder(this.getAttribute("data-id"));
	});
	//breadcrumb dropdown element is clicked
	$("#breadcrumb-dropdown").on("click", ".dropdown-element", function() {
		console.log(this.getAttribute("data-id"));
		setFolder(this.getAttribute("data-id"));
	});
	$("#breadcrumb .custom-breadcrumb").on("click", function() {
		var id = this.getAttribute('data-id');
		setFolder(id);
	});
	var rootCrumb = document.getElementById('root-nav');
	rootCrumb.oncontextmenu = function(e) {
		createDropdownMenu(rootCrumb);
		MoveDropdownItemsToElement(this);
		e.preventDefault();
	}
	RenderBreadCrumbPath(ROOT);
});
//peter
$(document).ready(function() {
	$("#search-box").on('keyup', function(e) {
		if ($(this).val().length == 0) {
			$("#clear-btn").attr("disabled", true);
			return;
		}
		$("#clear-btn").attr("disabled", false);
		if (e.keyCode == 13) {
			CreateSearchCrumb($(this).val());
			searchFileSystem($(this).val());
		}
	});
	$("#clear-btn").click(function() {
		$("#search-box").val("").focus();
		$("#clear-btn").attr("disabled", true);
	});
});

function searchFileSystem(m) {
	var found = [];
	$.each(filesystem, function(key, value) {
		if (value.name.indexOf(m) > -1) {
			found.push(value);
		}
	});
	displayList(null, found);
}
//emil
function displayList(parent, childrenObjects) {
	var holder = $("#tableView")[0];
	$(holder).empty();
	var iconName;
	$.each(childrenObjects, function(id, value) {
		var row = el("section", {
			"data-id": value.id,
			class: "row listViewItem"
		});
		if (value.type == "folder") {
			iconName = "fa fa-folder-open fa-3x";
		}
		if (value.type == "file") {
			iconName = "fa fa-file-o fa-3x";
		}
		var icon = el("section", {
			class: "col-lg-1 col-md-1"
		});
		var fa = el("i", {
			class: iconName
		});
		icon.appendChild(fa);
		var name = el("section", {
			class: "col-lg-6 col-md-6"
		});
		var h4 = el("h4", {
			html: value.name
		});
		name.appendChild(h4);
		var date = el("section", {
			class: "col-lg-5 col-md-5"
		});
        if (value.type == "file") {
            var h4 = el("h4", {
                html: moment(value.updated * 1000).format("YYYY-MM-DD")
            });
            date.appendChild(h4);
        }
		row.appendChild(icon);
		row.appendChild(name);
		row.appendChild(date);
		holder.appendChild(row);
	});
}
// Login functions etc.
var userData = {
	"ragnar": {
		"id": "ragnar",
		"password": "lol"
	},
	"roger": {
		"id": "roger",
		"password": "hello"
	}
}

function correctPW(userName, inputPassword) {
	var user = userData.hasOwnProperty(userName);
	if (user == true) {
		var pw = userData[userName].password;
		if (inputPassword == pw) {
			alert("yay");
		} else {
			alert("incorrect pw")
		}
	}
	if (user == false) {
		alert("incorrect username");
	}
}
(function($, window) {
	$.fn.contextMenu = function(settings) {
		return this.each(function() {
			// Code Goes Here
			$(this).on("contextmenu", function(e) {
				var $menu = $(settings.menuSelector).data("invokedOn", $(e.target)).show().css({
					position: "absolute",
					left: getMenuPosition(e.clientX, 'width', 'scrollLeft'),
					top: getMenuPosition(e.clientY, 'height', 'scrollTop')
				}).off('click').on('click', 'a', function(e) {
					$menu.hide();
					var $invokedOn = $menu.data("invokedOn");
					var $selectedMenu = $(e.target);
					settings.menuSelected.call(this, $invokedOn, $selectedMenu);
				});
				return false;
			});
			//make sure menu closes on any click
			$('body').click(function() {
				$(settings.menuSelector).hide();
			});
		});

		function getMenuPosition(mouse, direction, scrollDir) {
			var win = $(window)[direction](),
				scroll = $(window)[scrollDir](),
				menu = $(settings.menuSelector)[direction](),
				position = mouse + scroll;
			// opening menu would pass the side of the page
			if (mouse + menu > win && menu < mouse) position -= menu;
			return position;
		}
	};
})(jQuery, window);
$(document).ready(function() {
	//Handles menu drop down
	$('.dropdown-menu').find('form').click(function(e) {
		e.stopPropagation();
	});
	//Logout button
	$("#btnLogout").click(function() {
		//alert("Value: " + $("#emailInput").val() + " Password: " + $("#passwordInput").val());
		correctPW($("#emailInput").val(), $("#passwordInput").val());
	});
	$("#tableView").on("click", ".listViewItem", function() {
		setFolder(this.getAttribute("data-id"));
    });
    $("#tableView").on("contextmenu", ".row", function(e) {
        $("#contextMenu").css("top", e.clientY).css("left", e.clientX).css("display", "block").removeClass("hidden").attr("data-id", $(e.target).closest(".row").attr("data-id"));
        e.preventDefault();
        e.stopPropagation();
    });
    $(document).on("click", function() {
        $("#contextMenu").addClass("hidden");
    });
    $("#traceDropdown").on("click", function() {
        $("#traceModal").attr("data-id", $("#contextMenu").attr("data-id"));
	});
	
	$("#changeAlert").on("click", function() {
		data_id = $("#contextMenu").attr("data-id");
		$.post("subscribe", {fileKey: data_id});
	});	
});
//reem
/* =========================================================
 * reem.js v1.0.0
 * =========================================================
 * ========================================================= */
// <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js"></script>
/*
var FileTraceability = 
{"12345": 
{
   "name":"Volvo",
   "project_name":"P01", 
   "project_id":"12345",
   "id":"12345",
   "File1":[{ "type":"CAD","id": "1234111", "project_id":"12345","name":"1.prt", "path":"c:-Documents-prt1-1.prt"},
            { "type":"CAD","id": "123454", "project_id":"12345","name":"2.prt", "path":"c:-Documents-prt1-2.prt"}, 
            { "type":"CAD","id": "123455", "project_id":"12345","name":"3.prt", "path":"c:-Documents-prt1-3.prt"}],

   "File2": [{"type":"STL",  "id": "1234","project_id":"12345" ,"name":"1.stl" ,"path":"c:-Documents-stl1-1.stl"} , 
             {"type":"STL",  "id": "12343","project_id":"12345" ,"name":"2.stl" ,"path":"c:-Documents-stl1-2.stl"} , 
		     {"type":"STL",  "id": "12344","project_id":"12345" ,"name":"3.stl" ,"path":"c:-Documents-stl1-3.stl"} ],

   "File3": [{"type":"Build", "id": "1234666","project_id":"12345", "name":"B001"} ,
             {"type":"Build", "id": "1534556","project_id":"12345", "name":"B002"} ],

   "image":[{"type":"Image", "id": "12345645", "project_id":"12345","Build_id":"B001" , "path":"c:-Documents-img1-1.img"} ,
            {"type":"Image", "id": "12346666645", "project_id":"12345","Build_id":"B002" , "path":"c:-Documents-img1-1.img"} ],

   "material":[{"type":"material","id": "12345621", "project_id":"12345" ,"Build_id":"B001" ,"material_name":"carbon"} ,
               {"type":"material","id": "1234500041", "project_id":"12345" ,"Build_id":"B002" ,"material_name":"Powder"}],

   "measures":[{ "type":"material_measure","id": "1234588", "project_id":"12345","Build_id":"B001","material_name":"carbon", "measure":"measure1.pdf"},
               { "type":"material_measure","id": "121234588", "project_id":"12345","Build_id":"B002","material_name":"Powder", "measure":"measure1.pdf"}    ],    

   "File4":[{"type":"SLM", "id": "12345111","project_id":"12345",  "Build_id":"B001", "SLM_id":"Boo1.slm", "name":"B0343",  "path":"c:-Documents-slm1-B001.slm"} ,
            {"type":"SLM","id": "12345222", "project_id":"12345", "Build_id":"B001", "SLM_id":"Boo2.slm","name":"B0344" ,  "path":"c:-Documents-slm1-B001.slm"} ,
			{"type":"SLM","id": "1234577722", "project_id":"12345", "Build_id":"B002", "SLM_id":"Boo2.slm","name":"B0344" ,  "path":"c:-Documents-slm1-B002.slm"}]
}  

} 
*/
function getProjectId(id) {
	var found;
	$.each(filesystem, function(key, value) {
		if (value.id)
			if (value.id == id) found = value.project_id;
	});
	return found;
}

function getcustomer(project_id) {
	var found;
	$.each(filesystem, function(key, value) {
		if (value.project_id && value.extention)
			if (value.project_id == project_id && value.extention == "customer") found = value;
	});
	return found;
}

function getCADlist(project_id) {
	var found = [];
	$.each(filesystem, function(key, value) {
		if (value.project_id && value.extention)
			if (value.project_id == project_id && value.extention == "CAD") found.push(value);
	});
	return found;
}

function getPRTlist(project_id) {
	var found = [];
	$.each(filesystem, function(key, value) {
		if (value.project_id && value.extention)
			if (value.project_id == project_id && value.extention == "STL") found.push(value);
	});
	return found;
}

function getBuildlist(project_id) {
	var found = [];
	$.each(filesystem, function(key, value) {
		if (value.project_id && value.extention)
			if (value.project_id == project_id && value.extention == "build") found.push(value);
	});
	return found;
}

function getImage(project_id, build_id) {
	var found = [];
	$.each(filesystem, function(key, value) {
		if (value.project_id && value.extention && value.build_id)
			if (value.project_id == project_id && value.extention == "image" && value.build_id == build_id) found.push(value);
	});
	return found;
}

function getMaterial(project_id, build_id) {
	var found = [];
	$.each(filesystem, function(key, value) {
		if (value.project_id && value.extention && value.build_id)
			if (value.project_id == project_id && value.extention == "material" && value.build_id == build_id) found.push(value);
	});
	return found;
}

function getMaterialMeasures(project_id, build_id, material_id) {
	var found = [];
	$.each(filesystem, function(key, value) {
		if (value.project_id && value.extention && value.build_id && material_id)
			if (value.project_id == project_id && value.extention == "measure" && value.build_id == build_id && value.material_id == material_id) found.push(value);
	});
	return found;
}

function getSLM(project_id, build_id) {
	var found = [];
	$.each(filesystem, function(key, value) {
		if (value.project_id && value.extention && value.build_id)
			if (value.project_id == project_id && value.extention == "SLM" && value.build_id == build_id) found.push(value);
	});
	return found;
}

function createHREF(value) {
	var a = document.createElement('a');
	var linkText = document.createTextNode(value.name);
	a.appendChild(linkText);
	a.setAttribute('href', "#");
	a.setAttribute('class', 'list-group-item');
	a.setAttribute('data-id', value.id);
	return a;
}

function createHREFSUB(value) {
	var a = document.createElement('a');
	var linkText = document.createTextNode(value.name);
	a.appendChild(linkText);
	a.setAttribute('href', "#");
	a.setAttribute('class', 'list-group-item');
	a.setAttribute('data-parent', '#SubMenu1');
	return a;
}

function appendItem(fileview, value, group) {
	var ahref;
	if (group == "1") var ahref = createHREF(value);
	else if (group == "0") var ahref = createHREFSUB(value);
	fileview.appendChild(ahref);
}

function createHREFMAIN(text, id_name, dataparent) {
	var a = document.createElement('a');
	var linkText = document.createTextNode(text);
	var i = document.createElement('i');
	i.setAttribute('class', 'fa fa-caret-down');
	a.appendChild(linkText);
	a.appendChild(i);
	a.setAttribute('href', id_name);
	a.setAttribute('class', 'list-group-item');
	a.setAttribute('data-toggle', 'collapse');
	a.setAttribute('data-parent', dataparent);
	return a;
}

function createDIV(id_name) {
	var div = document.createElement('div');
	div.setAttribute('class', 'collapse list-group-submenu');
	div.setAttribute('id', id_name);
	return div;
}

function createsublist(fileview, href_id, project_id, value) {
	var id_name = "SubMenu" + href_id;
	var href = createHREFMAIN(value.name, '#' + id_name, '#SubMenu');
	fileview.appendChild(href);
	var div = createDIV(id_name);
	fileview.appendChild(div);
	// view SLM files
	var id_name = "SubMenu5" + href_id;
	var href6 = createHREFMAIN("SLMs", '#' + id_name, '#SubMenu1');
	div.appendChild(href6);
	var div6 = createDIV(id_name);
	div.appendChild(div6);
	var files = getSLM(project_id, value.id);
	for (i = 0; i < files.length; i++) {
		var ahrefl = createHREF(files[i]);
		div6.appendChild(ahrefl);
	}
	// view Images
	var id_name = "SubMenu4" + href_id;
	var href5 = createHREFMAIN("Images", '#' + id_name, '#SubMenu1');
	div.appendChild(href5);
	var div5 = createDIV(id_name);
	div.appendChild(div5);
	var images = getImage(project_id, value.id);
	for (f = 0; f < images.length; f++) {
		var ahrefl = createHREF(images[f]);
		div5.appendChild(ahrefl);
	}
	// view Material 
	var id_name = "SubMenu6" + href_id;
	var href4 = createHREFMAIN("Material", '#' + id_name, '#SubMenu1');
	div.appendChild(href4);
	var div4 = createDIV(id_name);
	div.appendChild(div4);
	var material = getMaterial(project_id, value.id);
	for (i = 0; i < material.length; i++) {
		var ahrefl = createHREF(material[i]);
		div4.appendChild(ahrefl);
	}
	// view Measures 
	var id_name = "SubMenu2" + href_id;
	var href3 = createHREFMAIN("Measures", '#' + id_name, '#SubMenu1');
	div.appendChild(href3);
	var div3 = createDIV(id_name);
	div.appendChild(div3);
	for (x = 0; x < material.length; x++) {
		var files = getMaterialMeasures(project_id, value.id, material[x].id);
		console.log(material[x]);
		for (i = 0; i < files.length; i++) {
			var ahrefl = createHREF(files[i]);
			div3.appendChild(ahrefl);
		}
	}
}

function createBuildNode(fileview, project_id) {
	var build_id = getBuildlist(project_id);
	console.log(build_id);
	for (t = 0; t < build_id.length; t++) {
		createsublist(fileview, t, project_id, build_id[t]);
	}
}
////////////////////////////////////////////////////////////
var myuser = "mazen"; // example to be replaced with current user
// return array of files names according to status ( returen open files,  returen closed files)
function getstatusFiles(status) {
	var found = [];
	$.each(filesystem, function(key, value) {
		if (value.status == status) found.push(value);
	});
	return found;
}
// return array of files names according to status ( returen open files,  returen closed files, or owner)
function getMyFiles(user_id) {
	var found = [];
	$.each(filesystem, function(key, value) {
		if (value.owner)
			for (j = 0; j < value.owner.length; j++)
				if (value.owner[j] == user_id) {
					found.push(value);
					break;
				}
    });
    return found;
}
// reurn shared with me files
function getUserFile(user_id) {
	var found = [];
	$.each(filesystem, function(key, value) {
		if (value.user)
			for (j = 0; j < value.user.length; j++)
				if (value.user[j] == user_id) {
					found.push(value);
					break;
				}
	});
	return found;
}
// return array of files names according to lastModified date 
function getFilesLastModified(monthcnt) {
	var found = [];
	var cur = new Date();
	var beforedayscnt = new Date(cur.setMonth(cur.getMonth() - monthcnt)).toISOString().slice(0, 10); // setDate, getDate can be used
	$.each(filesystem, function(key, value) {
		if (value.lastModified)
			if (value.lastModified >= beforedayscnt) found.push(value);
	});
	return found;
}

function renderSidebarTree(myuser) {
	var fileview = document.getElementById("fileview4");
	$(fileview).empty();
	var files = getUserFile(myuser);
	for (i = 0; i < files.length; i++) {
		appendItem(fileview, files[i], "1");
	}
	// return my files
	var fileview = document.getElementById("fileview1");
	$(fileview).empty();
	var files = getMyFiles(myuser);
	for (i = 0; i < files.length; i++) {
        if (!files[i]) {
            continue;
        }
		appendItem(fileview, files[i], "1");
	}
	// return opened files
	var fileview = document.getElementById("fileview3");
	$(fileview).empty();
	var files = getstatusFiles("open");
	for (i = 0; i < files.length; i++) {
		appendItem(fileview, files[i], "1");
	}
	// return closed files
	var fileview = document.getElementById("fileview2");
	$(fileview).empty();
	var files = getstatusFiles("closed");
	for (i = 0; i < files.length; i++) {
		appendItem(fileview, files[i], "1");
	}
	// return last modified files 
	var fileview = document.getElementById("fileview5");
	$(fileview).empty();
	var files = getFilesLastModified(1); // 1 means one month
	for (i = 0; i < files.length; i++) {
		appendItem(fileview, files[i], "1");
	}
	$("#MainMenu").on("click", ".list-group-item", function() {
		setFolder($(this).attr("data-id"));
	})
}

function renderTraceTree(id) {
	var project_id = getProjectId(id);
	var fileview = document.getElementById("fileview6");
	$(fileview).empty();
	var files = getCADlist(project_id);
	for (i = 0; i < files.length; i++) {
		appendItem(fileview, files[i], "1");
	}
	var fileview = document.getElementById("fileview11");
	$(fileview).empty();
	var customer = getcustomer(project_id);
	appendItem(fileview, customer, "1");
	var fileview = document.getElementById("fileview12");
	$(fileview).empty();
	var files = getPRTlist(project_id);
	for (i = 0; i < files.length; i++) {
		appendItem(fileview, files[i], "1");
	}
	var fileview = document.getElementById("demo7");
	$(fileview).empty();
	createBuildNode(fileview, project_id);
	$("#TraceMenu").on("click", ".list-group-item", function() {
		setFolder($(this).attr("data-id"));
	})
}
/*
 $(document).ready(function() {
	  // shared with me
      var fileview = document.getElementById("fileview4");
      $(fileview).empty();
	  var users = getUserFile(myuser);
      for (i = 0; i < users.length; i++) { 
         appendItem(fileview, users[i],"1");
      }
	  
	  // return my files
	  var fileview = document.getElementById("fileview1");
      $(fileview).empty();
      var files = getMyFiles(myuser);
      for (i = 0; i < files.length; i++) {
        appendItem(fileview, files[i],"1");
      }
	  
	  // return opened files
	  var fileview = document.getElementById("fileview3");
      $(fileview).empty();
      var files = getstatusFiles("open");
      for (i = 0; i < files.length; i++) {
        appendItem(fileview, files[i],"1");
	  }
	  
	  // return closed files
	  var fileview = document.getElementById("fileview2");
      $(fileview).empty();
      var files = getstatusFiles("closed");
      for (i = 0; i < files.length; i++) {
        appendItem(fileview, files[i],"1");
      }
	  // return last modified files 
	  var fileview = document.getElementById("fileview5");
      $(fileview).empty();
      var files = getFilesLastModified(1); // 1 means one month
      for (i = 0; i < files.length; i++) {
        appendItem(fileview, files[i],"1");
      } 
	  
	  $("#MainMenu").on("click",".list-group-item",function(){
		  setFolder($(this).attr("data-id"));
	  })
	  
	    
/////// traceability 
	  var project_id =  getProjectId("cad1");  

	  var fileview = document.getElementById("fileview6");
      $(fileview).empty();
      var files = getCADlist(project_id);  
       for (i = 0; i < files.length; i++) {
        appendItem(fileview, files[i],"1");
      }
	   
	  var fileview = document.getElementById("fileview11");
      $(fileview).empty();
	  var customer = getcustomer(project_id);
      appendItem(fileview, customer ,"1");
	  
       
	  var fileview = document.getElementById("fileview12");
      $(fileview).empty();
      var files = getPRTlist(project_id);  
      for (i = 0; i < files.length; i++) {
        appendItem(fileview, files[i],"1"); 
      }
	  
    
	 var fileview = document.getElementById("demo7");
     $(fileview).empty();
	 createBuildNode(fileview,project_id); 
	  
	 $("#TraceMenu").on("click",".list-group-item",function(){
	  setFolder($(this).attr("data-id"));
	  }) 
 }); */
//joshua