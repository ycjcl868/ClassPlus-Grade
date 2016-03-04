<?php
header("content-type:text/html;charset=utf-8");
error_reporting(0);

$interface = $_GET['interface'];


if ($interface == 'teacher') {
    //teacher.html接口
    $file_contents = file_get_contents('http://115.28.26.202/ClassPlus/grade/getgrades?account=' . $_GET['account'] . '&terms=' . $_GET['terms']);
    $json = $file_contents;
    echo $json;

} else if ($interface == 'student') {
    //student.html接口
    $file_contents = file_get_contents('http://115.28.26.202/ClassPlus/grade/getgrade?account=' . $_GET['account'] . '&terms=' . $_GET['terms']);
    $json = $file_contents;
    echo $json;

} else if ($interface == 'subject') {
    //subject.html接口
    $data = array("account" => $_GET['account'], "terms" => $_GET['terms'], "subject" => $_GET['subject']);
    $data = http_build_query($data);
    $opts = array(
        'http' => array(
            'method' => "POST",
            'header' => "Content-type: application/x-www-form-urlencoded\r\n" .
                "Content-length:" . strlen($data) . "\r\n" .
                "Cookie: foo=bar\r\n" .
                "\r\n",
            'content' => $data,
        )
    );
    $cxContext = stream_context_create($opts);
    $sFile = file_get_contents("http://115.28.26.202/ClassPlus/grade/single", false, $cxContext);
    echo $sFile;

} else if ($interface == 'list') {
    //list.html接口
    $type = $_GET['type'];
    if ($type == 3)
        $type = 0;
//列表
    if ($type == 0) {
        $data = array("account" => $_GET['account'], "terms" => $_GET['terms']);
        $data = http_build_query($data);
        $opts = array(
            'http' => array(
                'method' => "POST",
                'header' => "Content-type: application/x-www-form-urlencoded\r\n" .
                    "Content-length:" . strlen($data) . "\r\n" .
                    "Cookie: foo=bar\r\n" .
                    "\r\n",
                'content' => $data,
            )
        );
        $cxContext = stream_context_create($opts);
        $sFile = file_get_contents("http://115.28.26.202/ClassPlus/grade/ranking", false, $cxContext);
        echo $sFile;


    } //进步生、退步生
    else {
        $data = array("account" => $_GET['account'], "terms" => $_GET['terms'], "type" => $_GET['type']);
        $data = http_build_query($data);
        $opts = array(
            'http' => array(
                'method' => "POST",
                'header' => "Content-type: application/x-www-form-urlencoded\r\n" .
                    "Content-length:" . strlen($data) . "\r\n" .
                    "Cookie: foo=bar\r\n" .
                    "\r\n",
                'content' => $data,
            )
        );
        $cxContext = stream_context_create($opts);
        $sFile = file_get_contents("http://115.28.26.202/ClassPlus/grade/difference", false, $cxContext);
        echo $sFile;
    }


}




