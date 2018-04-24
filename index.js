#!/usr/bin/env node

var FS = require('fs'),
    PATH = require('path'),
    SVGO = require('svgo'),
    cheerio = require('cheerio'),
    $ = cheerio.load('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0" style="display:none;"></svg>'),
    iconFolder = PATH.resolve(__dirname, process.argv[2]),
    spriteFile = PATH.resolve(__dirname, process.argv[3]),
    svgNode,
    symbolNode,
    baseSvgNode = $('svg');


function parseAndAppend (fileContent, fileName) {
    svgNode = $(fileContent);
    symbolNode = $('<symbol></symbol>');

    symbolNode.attr('viewBox', svgNode.attr('viewbox'));
    symbolNode.attr('id', fileName);
    symbolNode.append(svgNode.contents())

    symbolNode
        .children()
        .each(function (i, kid) {
            $(kid)
                .removeAttr('fill')
                .removeAttr('stroke')
        });

    baseSvgNode.append(symbolNode)
}

exports.createSprite = function() {
    FS.readdir(iconFolder, function(err, files) {
        files.forEach(function(file, index) {

            var filepath =  iconFolder +"/"+ file;
            var fileName = file.slice(0, -4);

            FS.readFile(filepath, 'utf8', function(err, data) {

                if (err) {
                    throw err;
                }

                var svgo = getSVGO(fileName);

                svgo.optimize(data, {path: filepath}).then(function(result) {
                    parseAndAppend(result.data, fileName);

                    if (files.length, index+1) {
                        FS.writeFile(spriteFile, baseSvgNode, 'utf-8', function () {  });
                    };
                });

            });
        });
    });
}


function getSVGO(prefix) {
    var svgo = new SVGO({
        plugins: [{
            cleanupAttrs: true,
        }, {
            removeDoctype: true,
        },{
            removeXMLProcInst: true,
        },{
            removeComments: true,
        },{
            removeMetadata: true,
        },{
            removeTitle: true,
        },{
            removeDesc: true,
        },{
            removeUselessDefs: true,
        },{
            removeEditorsNSData: true,
        },{
            removeEmptyAttrs: true,
        },{
            removeHiddenElems: true,
        },{
            removeEmptyText: true,
        },{
            removeEmptyContainers: true,
        },{
            removeViewBox: false,
        },{
            cleanUpEnableBackground: true,
        },{
            convertStyleToAttrs: true,
        },{
            convertColors: true,
        },{
            convertPathData: true,
        },{
            convertTransform: true,
        },{
            removeUnknownsAndDefaults: true,
        },{
            removeNonInheritableGroupAttrs: true,
        },{
            removeUselessStrokeAndFill: true,
        },{
            removeUnusedNS: true,
        },{
            cleanupIDs: {prefix: prefix}
        },{
            cleanupNumericValues: true,
        },{
            moveElemsAttrsToGroup: true,
        },{
            moveGroupAttrsToElems: true,
        },{
            collapseGroups: true,
        },{
            removeRasterImages: false,
        },{
            mergePaths: true,
        },{
            convertShapeToPath: true,
        },{
            sortAttrs: true,
        },{
            transformsWithOnePath: false,
        },{
            removeDimensions: true,
        },{
            removeAttrs: {attrs: '(stroke|fill)'},
        }]
    });

    return svgo;
}

this.createSprite();