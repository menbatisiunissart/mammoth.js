
var mammoth = require("./lib/index");

function generateHtml(docPath) {
    var path = docPath.toString();
    return mammoth.convertToHtml({path: path});
}

var docPath = "./input/Test_upload_12_Pages.docx";
async function run(docPath) {
    var html = await generateHtml(docPath);
    console.log(html);
}

run(docPath);

