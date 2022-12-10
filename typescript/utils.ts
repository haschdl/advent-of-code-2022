const printGrid = (arr: any, separator?:string) => {

    let res = ""
    let sep = "\t";
    
    if(separator !== undefined)
        sep=separator
    
    
    const reduceItem = (item: any) => {
        if (Array.isArray(item))
            return item.reduce((a, b) => a = `${a}${sep}${b}`,"")
        return item;
    }
    //naive check for array of arrays
    if (Array.isArray(arr[0]))
        res = arr.reduce((a:string, b:string) => a = `${a}\n${reduceItem(b)}`,"");
    else
        res = arr.reduce((a:string, b:string) => a = `${a}${b}${sep}`,"")

    console.log(res)
}

export { printGrid }
