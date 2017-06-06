const Employee = [
    {name: 'Manh Nguyen', edu: "IT"},
    {name: "Tuan Hung", edu: "Singer"},
    {name: "Kieu Trinh", edu: "Dancer"}
];

export default () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve(Employee);
            //reject("Loi get data");
        }, 3000)
    })
}