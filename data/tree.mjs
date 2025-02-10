const Tree = function (root) { //En stor bokstav: Forteller at det er en type.

    return {root};

}

const Node = function(data,...connections) { //...rest operator: uendelig mengder av argumenter: Den tar alt som kommer inn og legger det i en array for deg.
    return {data,connections:[...connections]};  //...spread operator: Samler sammen resten av argumentene i en array.
}

export {Tree, Node};

// [1,2,3,[1,2,3]] --> [1,2,3,1,2,3];
//process.argv[0] = node
//process.argv[1] = navnet på scriptet ditt
//... Alt deretter er argumentene du sender inn.

//node server.mjs -p 3000 = -p betyr at det er en flagg. 3000 er verdien til flagget.
//Hvis vi vil vite hvilken funksjon har vi kalt, kan vi bruke process.argv[2].
//Det finnes et skjult argument som heter --inspect. Dette er for debugging.
//trace() er en funksjon som logger ut alle funksjonskallene som skjer i programmet ditt. Det finnes en hel haug av skjulte variabler i Node.js.
