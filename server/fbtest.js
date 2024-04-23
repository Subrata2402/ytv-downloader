const { ndown } = require("nayan-media-downloader")
async function download(url) {
    const URL = await ndown(url)
    console.log(URL)
}
download("https://www.facebook.com/watch?v=478493334504212")

/*
https://video-lga3-2.xx.fbcdn.net/v/t42.1790-2/10000000_766497428531251_5416984836043806913_n.mp4?_nc_cat=109&ccb=1-7&_nc_sid=55d0d3&efg=eyJybHIiOjM1NiwicmxhIjo0MDk2LCJ2ZW5jb2RlX3RhZyI6InN2ZV9zZCIsInZpZGVvX2lkIjoyOTc3MzI3NjAwMTI3OTJ9&_nc_ohc=jKVZ1m3NPuAAb5p1Tqz&_nc_oc=AdhFrPytUSDxrI1vqmCDF3bKPJ-y4tKzP51Y6fdNTVQE4--NYdJl-I8QuFoNsDdW6-Q&rl=356&vabr=198&_nc_ht=video-lga3-2.xx&edm=AGo2L-IEAAAA&oh=00_AfCLW5ImuiPoXhqbMt-EfoNxxzb2QNBtxaIObyCFGCOQnA&oe=662DCB69&dl=1&dl=1

https://video-ams4-1.xx.fbcdn.net/v/t42.1790-2/10000000_3600664970184231_5753700020347150247_n.mp4?_nc_cat=103&ccb=1-7&_nc_sid=55d0d3&efg=eyJybHIiOjMwMiwicmxhIjo0MDk2LCJ2ZW5jb2RlX3RhZyI6InN2ZV9zZCIsInZpZGVvX2lkIjo0Nzg0OTMzMzQ1MDQyMTJ9&_nc_ohc=rLsh4yLnqxMQ7kNvgGg0gkG&rl=302&vabr=168&_nc_ht=video-ams4-1.xx&oh=00_AfCTeAKiXdrhR-XawK7n33svm_usJIjgUu-obN4r3NW6Jg&oe=662DE9A6&dl=1&dl=1
*/