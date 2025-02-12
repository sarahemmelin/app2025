const Tree = function (root) { //En stor bokstav: Forteller at det er en type.

    return {root};

}

const Node = function(data,...connections) { //...rest operator: uendelig mengder av argumenter: Den tar alt som kommer inn og legger det i en array for deg.
    return {data,connections:[...connections]};  //...spread operator: Samler sammen resten av argumentene i en array.
}



export function saveTree(tree) {
    return JSON.stringify(tree, null, 3);
}

export function inflateTree(data){
    return JSON.parse(data);
}


export {Tree, Node};

