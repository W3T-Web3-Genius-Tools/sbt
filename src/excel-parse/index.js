const fs = require('fs')
const path = require('path')

fs.readFile(path.join(__dirname, './data.txt'), (err, res) => {
    let isError = false;
    if (err) {
        console.log("有误，解析失败");
        return;
    }

    const resString = res.toString();
    const resultJSON = resString.split('\n').map(item => item.split('\t')).map(item => item.map(item => item.trim())).map(item => {
        if (!item[0] || !item[1] || !item[2]) {
            console.log('---提供的资源数值有误---');
            isError = true;
        }
        return {
            tokenId: item[0],
            userAddress: item[1],
            type: item[2],
        }
    }).map(item => {
        const dataTime = new Date().getTime()
        const metadata = {
            description: "Singing  Drinking  Cheering , We are Palling",
            image: `https://raw.githubusercontent.com/W3T-Web3-Genius-Tools/sbt/main/src/metadata/images/${item.tokenId}.png`,
            name: `${item.type} #${item.tokenId}`,
            tokenId: item.tokenId,
            attributes:
                [{trait_type: '荣誉类型', value: item.type},
                    {trait_type: '获奖人', value: item.userAddress},
                    {trait_type: '签署日期', "display_type": "date", value: dataTime},
                    {trait_type: '签署方', value: "0xf8D9d01c90B84dc99064968ED77b829Ab0A593f7"}]
        }
        return metadata
    })
    // 生成单文件-总文件
    fs.writeFileSync(path.join(__dirname, './metadata.json'), JSON.stringify(resultJSON, null, 2))
    fs.writeFileSync(path.join(__dirname, '../images-gen/src/data/data.json'), JSON.stringify(resultJSON, null, 2))
    // 生成多文件-单文件
    for (let i = 0; i < resultJSON.length; i++) {
        console.log(resultJSON[i])
        fs.writeFileSync(path.join(__dirname, `../metadata/json/${resultJSON[i].tokenId}.json`), JSON.stringify(resultJSON[i], null, 2))
    }

    if (!isError) {
        console.log("解析成功");
    }
})

