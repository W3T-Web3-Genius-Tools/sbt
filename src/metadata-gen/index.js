const fs = require('fs')
const path = require('path')

const info = {
    tokenId: "1",
    type: "航海家",
    userAddress: "0xf8D9d01c90B84dc99064968ED77b829Ab0A593f7",
    signatureData: new Date().getTime(),
    signatory: "0xf8D9d01c90B84dc99064968ED77b829Ab0A593f7"
}

const metadata = {
    description: "Singing  Drinking  Cheering , We are Palling",
    image: `https://raw.githubusercontent.com/CheersPals/cheerspalsofficial/main/images/${info.tokenId}.png`,
    name: `${info.type} #${info.tokenId}`,
    attributes:
        [{trait_type: '荣誉类型', value: info.type},
            {trait_type: '获奖人', value: info.userAddress},
            {trait_type: '签署日期', "display_type": "date", value: info.signatureData},
            {trait_type: '签署方', value: info.signatory}]
}

fs.writeFileSync(path.join(__dirname, `../metadata/json/${info.tokenId}.json`), JSON.stringify(metadata, null, 2))