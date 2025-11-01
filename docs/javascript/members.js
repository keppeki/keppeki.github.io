'use strict';

// TODO: CSV パーサーはライブラリに置き換える (node でしか動かないかも？)
// csvファイルのurlを入力すると2次元配列を返してくれる
// 参考: https://qiita.com/rubyfmzk_/items/1902453ca13e4d8662ee
function getCsv(url){
  //CSVファイルを文字列で取得。
  var txt = new XMLHttpRequest();
  txt.open('get', url, false);
  txt.send();

  //改行ごとに配列化
  var arr = txt.responseText.split('\n');

  //1次元配列を2次元配列に変換
  var res = [];
  for(var i = 0; i < arr.length; i++){
    //空白行が出てきた時点で終了
    if(arr[i] == '') break;

    //","ごとに配列化
    res[i] = arr[i].split(',');

    /*for(var i2 = 0; i2 < res[i].length; i2++){
      //数字の場合は「"」を削除
      if(res[i][i2].match(/\-?\d+(.\d+)?(e[\+\-]d+)?/)){
        res[i][i2] = parseFloat(res[i][i2].replace('"', ''));
      }
    }*/
    

  }
  return res;
}

// 要素にcolクラスを追加
function colConfig(col){
  col.classList.add("col-sm-6");
  col.classList.add("col-md-6");
  col.classList.add("col-lg-3");
}

// member: 各回生の紹介を記述する要素
// members: 各回生の紹介内容の2次元配列
// num: 何回生か
// 紹介を描画する
function drawMembers(member, members, num) {
  for (var i = 0; i < members.length; i++) {
    // 各回生に対し一つの行をあてる
    var row;
    if(i == 0) {
      // num 回生の行を作る (あんまり意味ない気がする)
      const div = document.createElement("div");
      row = member.appendChild(div);
      row.classList.add("row");
      row.id = 'row_' + num;
    }
    else {
      // num 回生の行を取得 (あんまり意味ない気がする)
      row = document.getElementById('row_' + num);
    }

    // 各団員に一つの列をあてる
    const div = document.createElement("div");
    const col = row.appendChild(div);
    colConfig(col);

    // 画像を入れる
    const p = document.createElement("p");
    const image = col.appendChild(p);
    image.innerHTML = '<image src="../images/members2024/' + members[i][0]
                       + '.jpg" alt="" style="width:50%;" class="img-fluid"></image>';
    // 名前を入れる
    const span = document.createElement("span");
    const name = col.appendChild(span);
    name.style = 'font-style: oblique; font-size:120%; border-bottom: dashed 0.1rem white;'
    name.innerHTML = members[i][1] + '<br>';
    // プロフィールを入れる
    
    const dl = document.createElement("dl");
    const content = col.appendChild(dl);
    content.class = 'dl-horizontal'
    if(members[i].length<=9){
    content.innerHTML = '<dt>あだ名</dt><dd>' + members[i][2] + '</dd>'
                      + '<dt>役職</dt><dd>' + members[i][3] + '</dd>'
                      + '<dt>所属</dt><dd>' + members[i][4] + '</dd>'
                      + '<dt>趣味・特技</dt><dd>' + members[i][5] + '</dd>'
                      + '<dt>好きなもの</dt><dd>' + members[i][6] + '</dd>'
                      + '<dt>嫌いなもの</dt><dd>' + members[i][7] + '</dd>'
                      + '<dt>ひとこと</dt><dd>' + members[i][8] + '</dd>';
    }if (members[i].length>9) {
    content.innerHTML = '<dt>あだ名</dt><dd>' + members[i][2] + '</dd>'
                      + '<dt>役職</dt><dd>' + members[i][3] + '</dd>'
                      + '<dt>所属</dt><dd>' + members[i][4] + '</dd>'
                      + '<dt>趣味・特技</dt><dd>' + members[i][5] + '</dd>'
                      + '<dt>好きなもの</dt><dd>' + members[i][6] + '</dd>'
                      + '<dt>嫌いなもの</dt><dd>' + members[i][7] + '</dd>'
                      + '<dt>ひとこと</dt><dd>' + members[i][8] + '</dd>'
                      + '<dd><a href="' + members[i][9] + ' " target="_blank">最新情報(X)</dd>';
    }if(members[i].length>10){
       content.innerHTML = '<dt>あだ名</dt><dd>' + members[i][2] + '</dd>'
                      + '<dt>役職</dt><dd>' + members[i][3] + '</dd>'
                      + '<dt>所属</dt><dd>' + members[i][4] + '</dd>'
                      + '<dt>趣味・特技</dt><dd>' + members[i][5] + '</dd>'
                      + '<dt>好きなもの</dt><dd>' + members[i][6] + '</dd>'
                      + '<dt>嫌いなもの</dt><dd>' + members[i][7] + '</dd>'
                      + '<dt>ひとこと</dt><dd>' + members[i][8] + '</dd>'
                      + '<dd><a href="' + members[i][9] + ' " target="_blank">最新情報(X)</dd>'
                      + '<dd><a href="' + members[i][10] + ' " target="_blank">最新情報(instagram)</dd>';
                     }
    }
  }

const first = document.getElementById('first');
const firsts = getCsv('../csv/members_2024_32.csv');
const second = document.getElementById('second');
const seconds = getCsv('../csv/members_2024_31.csv');
const third = document.getElementById('third');
const thirds = getCsv('../csv/members_2024_30.csv');
const fourth = document.getElementById('fourth');
const fourths = getCsv('../csv/members_2024_29.csv');
drawMembers(first, firsts, 1);
drawMembers(second, seconds, 2);
drawMembers(third, thirds, 3);
drawMembers(fourth, fourths, 4);