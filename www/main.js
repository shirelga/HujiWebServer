//Object for each page
var login = {
	click: function()
	{
		var usrname = login.inputUsr.value;
		var pass = login.inputPass.value;
		if(usrname === "admin" && pass === "admin")
		{
			visible(login, profile);
			login.form.reset()

		}
		else
		{
			alert("Invalid username or password!");
			login.form.reset()
		}
	}
};
var profile = {
	click: function(event)
	{
		if(event.currentTarget === profile.logout)
		{
			visible(profile, login);
			alert("You have logged out!");
		}
		else if(event.currentTarget === profile.calc)
		{
			visible(profile, claulator);
		}
	},
	mouseOver: function()
	{
		profile.pic.src = "pic2.jpg";
	},
	mouseOut: function()
	{
		profile.pic.src = "pic1.jpg";
	}
};

var claulator = {

	num: 0,
	click: function(event)
	{
		createCalc();
	}
};

//Creating div and give it an id
function createDiv (id) {
	var div = document.createElement('div');
	div.setAttribute('id', id);
	document.body.appendChild(div);
	return div;
}

//create elements under there father, can set attribute
function createElement (elemnet, attrib, id, father) {
	var elem = document.createElement(elemnet);
	if(id !== "")
	{
		elem.setAttribute(attrib, id);
	}
	father.appendChild(elem);
	return elem;
}

function visible (elem1, elem2) {
	elem1.div.style.visibility = 'hidden';
	elem2.div.style.visibility = 'visible';
}

function createCalc () {
	// item = "calItem"+calcNum

	var calDiv = document.createElement("div");
	claulator.div.appendChild(calDiv);

	calDiv.id = "calItem"+claulator.num;

	calDiv.innerHTML = 
	 
	"<form id = "+calDiv.id+" name="+calDiv.id+">"+
	"<table>"+
	"<tr>"+
	"<TD>"+
	"<input type=\"text\"   name=\"input\" Size=\"16\">"+
	"<br>"+
	"</TD>"+
	"</tr>"+
	"<tr>"+
	"<TD>"+
	"<input type=\"button\" name=\"one\"   VALUE=\"  1  \" OnClick=\""+calDiv.id+".input.value += '1'\">"+
	"<input type=\"button\" name=\"two\"   VALUE=\"  2  \" OnCLick=\""+calDiv.id+".input.value += '2'\">"+
	"<input type=\"button\" name=\"three\" VALUE=\"  3  \" OnClick=\""+calDiv.id+".input.value += '3'\">"+
	"<input type=\"button\" name=\"plus\"  VALUE=\"  +  \" OnClick=\""+calDiv.id+".input.value += ' + '\">"+
	"<br>"+
	"<input type=\"button\" name=\"four\"  VALUE=\"  4  \" OnClick=\""+calDiv.id+".input.value += '4'\">"+
	"<input type=\"button\" name=\"five\"  VALUE=\"  5  \" OnCLick=\""+calDiv.id+".input.value += '5'\">"+
	"<input type=\"button\" name=\"six\"   VALUE=\"  6  \" OnClick=\""+calDiv.id+".input.value += '6'\">"+
	"<input type=\"button\" name=\"minus\" VALUE=\"  -  \" OnClick=\""+calDiv.id+".input.value += ' - '\">"+
	"<br>"+
	"<input type=\"button\" name=\"seven\" VALUE=\"  7  \" OnClick=\""+calDiv.id+".input.value += '7'\">"+
	"<input type=\"button\" name=\"eight\" VALUE=\"  8  \" OnCLick=\""+calDiv.id+".input.value += '8'\">"+
	"<input type=\"button\" name=\"nine\"  VALUE=\"  9  \" OnClick=\""+calDiv.id+".input.value += '9'\">"+
	"<input type=\"button\" name=\"times\" VALUE=\"  x  \" OnClick=\""+calDiv.id+".input.value += ' * '\">"+
	"<br>"+
	"<input type=\"button\" name=\"clear\" VALUE=\"  c  \" OnClick=\""+calDiv.id+".input.value = ''\">"+
	"<input type=\"button\" name=\"zero\"  VALUE=\"  0  \" OnClick=\""+calDiv.id+".input.value += '0'\">"+
	"<input type=\"button\" name=\"DoIt\"  VALUE=\"  =  \" OnClick=\""+calDiv.id+".input.value = eval("+calDiv.id+".input.value)\">"+
	"<input type=\"button\" name=\"div\"   VALUE=\"  /  \" OnClick=\""+calDiv.id+".input.value += ' / '\">"+
	"<br>"+
	"</TD>"+
	"</tr>"+
	"</TABLE>"+
	"</form>";

	claulator.num += 1;
}

//add div field for each page
login.div = createDiv('login');
profile.div = createDiv('profile');
profile.div.style.visibility = 'hidden';
claulator.div = createDiv('calculator');
claulator.div.style.visibility = 'hidden';

login.form = createElement('form', "id", "", login.div);
login.p = createElement('p', "id", "", login.form);

login.spanUsr = createElement('span', "id", "", login.p);
login.spanUsr.textContent = "Username";
login.inputUsr = createElement('input', "id",  "", login.spanUsr);
login.inputUsr.setAttribute("name", "username");
login.inputUsr.setAttribute("value", "username");
login.inputUsr.setAttribute("type", "text");


login.spanPass = createElement('span', "id", "", login.p);
login.spanPass.textContent = "Password";
login.inputPass = createElement('input', "id", "", login.spanPass);
login.inputPass.setAttribute("name", "password");
login.inputPass.setAttribute("value", "password");
login.inputPass.setAttribute("type", "password");

login.inputButt = createElement('input', "id", "", login.p);
login.inputButt.setAttribute("value", "send");
login.inputButt.setAttribute("type", "button");

login.inputButt.addEventListener('click', login.click, false);

profile.logout = createElement("input", "id", "", profile.div);
profile.logout.setAttribute("value", "logout");
profile.logout.setAttribute("type", "button");

profile.logout.addEventListener('click', profile.click, false);

profile.calc = createElement("input", "id", "", profile.div);
profile.calc.setAttribute("value", "calculator");
profile.calc.setAttribute("type", "button");

profile.calc.addEventListener('click', profile.click, false);
profile.user = createElement("p", "", "", profile.div);
profile.username = createElement("h1", "", "", profile.user);
profile.username.textContent = "Shirel Gazit";
profile.identity = createElement("p", "", "", profile.div);
profile.identity = createElement("h1", "", "", profile.identity);
profile.identity.textContent = "201299344";
profile.quate = createElement("p", "", "", profile.div);
profile.quate.textContent = "Always borrow money from a pessimist. He won't expect it back. Oscar Wild";
profile.divPic = createElement("div", "id", "pic1", profile.div);
profile.pic = createElement("img", "src", "pic1.jpg", profile.divPic);
profile.pic.addEventListener("mouseover" , profile.mouseOver, false);
profile.pic.addEventListener("mouseout" , profile.mouseOut, false);

claulator.newCalc = createElement("input", "", "", claulator.div);
claulator.newCalc.setAttribute("value", "calculator");
claulator.newCalc.setAttribute("type", "button");

claulator.newCalc.addEventListener('click', claulator.click, false);
createCalc();
