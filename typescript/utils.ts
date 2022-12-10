const printGrid = (arr: any) => {
    let res = ""

    const reduceItem = (item: any) => {
        if (Array.isArray(item))
            return item.reduce((a, b) => a = `${a}\t${b}`,"")
        return item;
    }
    //naive check for array of arrays
    if (Array.isArray(arr[0]))
        res = arr.reduce((a:string, b:string) => a = `${a}\n${reduceItem(b)}`,"");
    else
        res = arr.reduce((a:string, b:string) => a = `${a}${b}\t`,"")

    console.log(res)
}

export { printGrid }
