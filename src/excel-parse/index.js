const fs = require('fs')
const path = require('path')

const tokenType = {
    航海家: {
        tag: "Rookie–Badge of Navigators",
        desc: "The brand new world of Web3 is just like an ocean, where the waves are overwhelming while the views are magnificent. Anyone who would like to take part in it is a worrier.  Welcome, Navigators!"
    },
    探险家: {
        tag: "Graduates–Badge of Explorers",
        desc: "Now you are so skillful and so ready to explore the ocean of Web3 on your own! You have tech and knowledge as your paddles to deal with any trouble in the riptides. Set sail, the fearless Explorer!"
    },
    贡献者: {
        tag: "Contributor–Badge of Lighthouse",
        desc: "Sharing is the glory. Every tiny distribution is like a lighthouse in the ocean,  a shining star in the dark night, guiding the course for the sailing ships. What admirable Contributors!"
    },
}

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
            description: tokenType[item.type].desc,
            image: `https://raw.githubusercontent.com/W3T-Web3-Genius-Tools/sbt/main/src/metadata/images/${item.tokenId}.png`,
            name: `${tokenType[item.type].tag} #${item.tokenId}`,
            tokenId: item.tokenId,
            external_url: "https://github.com/W3T-Web3-Genius-Tools",
            attributes:
                [{trait_type: 'Type of Honor', value: tokenType[item.type].tag},
                    {trait_type: 'Award Address', value: item.userAddress},
                    {trait_type: 'Signature Date', "display_type": "date", value: dataTime},
                    {trait_type: 'Signatories', value: "0xf8D9d01c90B84dc99064968ED77b829Ab0A593f7"}]
        }
        return metadata
    })
    // 生成单文件-总文件
    fs.writeFileSync(path.join(__dirname, './metadata.json'), JSON.stringify(resultJSON, null, 2))
    fs.writeFileSync(path.join(__dirname, '../images-gen/src/data/data.json'), JSON.stringify(resultJSON, null, 2))
    // 生成多文件-单文件
    for (let i = 0; i < resultJSON.length; i++) {
        console.log(resultJSON[i])
        fs.writeFileSync(path.join(__dirname, `../metadata/metajson/${resultJSON[i].tokenId}.json`), JSON.stringify(resultJSON[i], null, 2))
    }

    if (!isError) {
        console.log("解析成功");
    }
})

