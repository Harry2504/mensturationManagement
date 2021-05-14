
function cramps(){
	let preffered = "Protein based food";
	let avoid = "Food rich in carbohydrates";
	let home = "Put a heating pad on your belly or lower back or taking a hot bath"
	let medicine = "ibuprofen(Advil) or naproxen(aleve)"
var net = {preffered:preffered, avoid:avoid,home:home, medicine:medicine};

return net;
}

function bloating(){
	let preffered = "Potassium rich foods";
	let avoid = "Salty foods and refined carbohydrates";
	let home = "Exercise and drink lots of water"
	let medicine = "diuretics"
var net = {preffered:preffered, avoid:avoid,home:home, medicine:medicine};

return net;
}

function sore(){
	let preffered = "Soya based foods";
	let avoid = "Salt, sugar and caffeine";
	let home = "Try wearing a supportive bra during ths time"
	let medicine = "ibuprofen or naproxen"
var net = {preffered:preffered, avoid:avoid,home:home, medicine:medicine};

return net;
}


function headache(){
	let preffered = "Caffeine";
	let avoid = "Citrus fruits";
	let home = "Try eating chocolate and drinking caffinated tea or soda"
	let medicine = "Pain relievers like aspirin"
var net = {preffered:preffered, avoid:avoid,home:home, medicine:medicine};

return net;
}


function nausea(){
	let preffered = "Bland foods like bananas, rice, applesauce, toast and tea and ginger candies";
	let avoid = "Eating heavy meals";
	let home = "Apply a cool compress to your forehead and sit in front of a fan to get fresh air"
	let medicine = "Dimenhydrinate "
var net = {preffered:preffered, avoid:avoid,home:home, medicine:medicine};

return net;
}


module.exports = {cramps:cramps, bloating:bloating, sore:sore, headache:headache,nausea:nausea };