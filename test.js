// const products = [
//     { id: 1, name: "Laptop", price: 50000 },
//     { id: 2, name: "Mouse", price: 500 },
//     { id: 3, name: "Keyboard", price: 1500 },
// ];
// const user = {
//     cartItems: [
//         { id: 1, quantity: 2 },  // user wants 2 laptops
//         { id: 3, quantity: 1 },  // user wants 1 keyboard
//     ],
// };


// const cartItems = products.map((product) => {
    
//     // find matching cart item
//     const item = user.cartItems.find((cartItem) => {
//         console.log("Rohit")
//         return cartItem.id === product.id;
//     });

//     // return product + quantity
//     return {
//         ...product,                 // spread full product object
//         quantity: item ? item.quantity : 0,  // if not found → quantity = 0
//     };
// });

// console.log(cartItems);



const name = ["Rohan", "Ayush", "Rahul"];
const res = [];
let i = 0;
// const ans = name.filter((n) => {
//     if(n==="Rahul"){
//         res.push(i);
//     } else{
//         i++;
//     }
// })

const ans1 = name.forEach(element => {
    if(element==="Rahul"){
        res.push(i);
    } else{
        i++;
    }
});

console.log(res);

