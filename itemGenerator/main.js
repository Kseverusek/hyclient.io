const dname = document.querySelector(".name");
const lore = document.querySelector(".lore");
const glint = document.querySelector(".glint");
const rarity = document.querySelector(".rarity");
const type = document.querySelector(".type");
const ability = document.querySelector(".ability");
const abilityCost = document.querySelector(".abilityCost");
const ether = document.querySelector(".ether");
const aether = document.querySelector(".aether");
const cooldown = document.querySelector(".cooldown");
const res = document.querySelector(".result");
const fields = [dname, lore, glint, rarity, type, abilityCost, ether, aether, cooldown];

window.onchange = (e) => {
    updateResult();
}

function updateResult() {
    let name = formatName(dname.value)
    let r = "Item "+name+" = new Item(Material.);";
    if(glint.checked) r+=name+".setEnchanted();";
    if(rarity.selectedOptions.length>0) {
        r+=name+".setRarity("+rarity.selectedIndex+");";
    }
    if(type.selectedOptions.length>0) r+=name+".setType(ItemType."+type.selectedOptions[0].innerHTML+");";
    if(ability.checked) r+=name+".setCost("+abilityCost.innerHTML+", FuelType."+(ether.value=="on"?"ETHER":"AETHER")+", "+cooldown.value+");";
    r+=name+".setName(\""+dname.value+"\");";
    r+=name+".setLore(\""+lore.value.replaceAll("\n", "\", \"")+"\");";

    r+="itemList.put("+name+".id, "+name+")";
    res.innerHTML = r.replaceAll(";", ";<br>");
}

function formatName(n) {
    n = n.toLowerCase();
    let r = "", nextUp = false;
    for(let i = 0; i < n.length; i++) {
        let c = n[i];
        if(nextUp) {
            r+=c.toUpperCase();
            nextUp = false;
        }
        else {
            if(c==" ") nextUp = true;
            else r+=c;
        }
    }
    return r;
}