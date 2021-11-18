$(function(){
	
	//初期設定
	var svgElm = $("#drawingCanvas"), //SVG要素を取得
        svgCode = $("#svg_code");
		movetoX = 0, //開始点(横方向)の初期化
		movetoY = 0, //開始点(縦方向)の初期化
		linetoStr = "", //LineToコマンド値の初期化
		strokeColor = "#000000", //描画色の初期化
		drawType = ""; //塗りつぶしの初期化
	
	/* ドラッグ開始 */
	$("#drawingCanvas").mousedown(function(event){
		strokeColor = $(".color").val(); //inputの色の設定を取得
		
		//PAINT(value: paint)が選択されていたら、塗りつぶし色を設定
		if($("input[name='drawtype']:checked").val() == "paint")
			drawType = strokeColor;
		else
			drawType = "none";
		
		movetoX = parseInt(event.pageX - svgElm.position().left); //SVG上のマウス座標(横方向)の取得
		movetoY = parseInt(event.pageY - svgElm.position().top); //SVG上のマウス座標(縦方向)の取得
		var pathElm = document.createElementNS("http://www.w3.org/2000/svg", "path"); //SVGのpath要素を作成
		svgElm.append(pathElm); //SVGに作成したpathを追加
		
		//追加したpathの各属性を設定
		svgElm.find("path:last").attr({
			"d": "", //pathデータ
			"fill": drawType, //塗りつぶし
			"stroke": strokeColor, //線の色
			"stroke-width": "3", //線の太さ
			"stroke-linecap": "round" //線の端を丸める
		});
		
		var linetoX = [], //描画点の横座標の初期化
			linetoY = [], //描画点の縦座標の初期化
			cntMoveto = 0; //描画点のカウンターを初期化
		linetoStr = 'M ' + movetoX + ' ' + movetoY + ' '; //d要素でpathの開始点を設定
		
        document.getElementById("svg_code").innerHTML += "<p>Path Start strokeColor:" + strokeColor + '<br>&lt;path d=&quot;';

		/* ドラッグ中 */
		$("#drawingCanvas").on("mousemove", function(event){
			event.preventDefault();
			linetoX[cntMoveto] = parseInt(event.pageX - svgElm.position().left); //SVG上のマウス座標(横方向)の取得
			linetoY[cntMoveto] = parseInt(event.pageY - svgElm.position().top); //SVG上のマウス座標(縦方向)の取得
			linetoStr = linetoStr + " L " + linetoX[cntMoveto] + " " + linetoY[cntMoveto]; //動いた後の新たなマウス座標を描画点として追加
			
			svgElm.find("path:last").attr("d", linetoStr); //pathデータ(d属性)の値を更新

            document.getElementById("svg_code").innerHTML += linetoStr;

			cntMoveto++; //カウンターをセット
		});
 
	/* ドラッグ終了 */
	}).mouseup(function(event){
		$("#drawingCanvas").off("mousemove"); //pathの描画を終了
        document.getElementById("svg_code").innerHTML += '&quot;&gt;&lt;&#047;path&gt;<p>End</p></p>';
	});
	
	//CLEARボタンをクリックしたら、SVGを空にする
	$(".clear").click(function(){
		svgElm.html("");
        svgCode.html("");
	});

});

const download = () => {
    // svg domを取得
    const svg = document.getElementById('drawingCanvas')

    // canvasを準備
    let canvas = document.createElement('canvas')
    canvas.width = svg.width.baseVal.value
    canvas.height = svg.height.baseVal.value

    // 描画をするための、canvasの組み込みオブジェクトを準備
    const ctx = canvas.getContext('2d')
    // imgオブジェクトを準備
    let image = new Image()

    // imageの読み込みが完了したら、onloadが走る
    image.onload = () => {
      // SVGデータをPNG形式に変換する
      // canvasに描画する drawImage(image, x座標, y座標, 幅, 高さ)
      ctx.drawImage(image, 0, 0, image.width, image.height)

      // ローカルにダウンロード
      let link = document.createElement("a")
      link.href = canvas.toDataURL() // 描画した画像のURIを返す data:image/png;base64
      link.download = "canvas.png"
  link.click()
    }
    // 読み込みに失敗したらこっちが走る
    image.onerror = (error) => {
      console.log(error)
    }

    // SVGデータをXMLで取り出す
    const svgData = new XMLSerializer().serializeToString(svg)
    // この時点で、上記のonloadが走る
    image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(unescape(encodeURIComponent(svgData)))
}