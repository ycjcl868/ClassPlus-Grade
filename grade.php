<?php
header("content-type:text/html;charset=utf-8");
$account = $_GET['account'];
$data1 = array("account" => $account);
$res = postData($data1,'http://115.28.26.202/ClassPlus/user/position');
if($res == 1){
    //如果是老师
     header("Location:teacher.html?account=".$account."&terms=1");
}else{
    //如果是学生
    header("Location:student.html?account=".$account."&terms=1");
}




function postData($arr,$url){
    $data = $arr;
    $data = http_build_query($data);
    $opts = array(
        'http'=>array(
            'method'=>"POST",
            'header'=>"Content-type: application/x-www-form-urlencoded\r\n".
                "Content-length:".strlen($data)."\r\n" .
                "Cookie: foo=bar\r\n" .
                "\r\n",
            'content' => $data,
        )
    );
    $cxContext = stream_context_create($opts);
    $sFile = json_decode(file_get_contents($url, false, $cxContext));
    return $sFile;
}










