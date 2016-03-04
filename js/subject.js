$(function () {
    var ajaxbg = $("#background,#progressBar");
    var subjects = ["excellence", "pass", "fail", "highest", "average", "lowest", "lastRanking", "thisRanking", "goalRanking"];
    var subjectsName = ["优秀率", "及格率", "不及格率", "最高成绩", "平均成绩", "最低成绩", "上次名次", "本次名次", "下次名次"];
    var account = GetQueryString("account");
    var subject = GetQueryString("subject");
    var terms = GetQueryString("terms");
    var role = GetQueryString("role");
    var Osubject = document.getElementById("subject");
    Osubject.innerHTML = change();
    var classname = document.getElementById("classname");
    var pict = document.getElementById("pict");
    var left = document.getElementById("left-grade");
    var right = document.getElementById("right-grade");
    var grades = $(".subjects-grades");
    var times = document.getElementById("times");
    var back = document.getElementById("back");
    times.innerHTML = 'No.' + terms;
    ajaxbg.show();
    ajax();
    function ajax() {
        $.ajax({
            type: 'get',
            url: 'process.php',
            dataType: 'json',
            data: {account: account, terms: terms, subject: subject, interface: 'subject'},
            timeout: 5000,
            success: function (res) {
                try {
                    ajaxbg.hide();
                    classname.innerHTML = res.classes["classname"];
                    if (res.classes["pict"] == 'null') {
                        pict.src = 'img/logo.png'
                    } else {
                        pict.src = "http://115.28.26.202/picture/" + res.classes["pict"]
                    }
                    if (res.scores == 0 && terms > 1) {
                        terms--;
                        window.location.href = 'subject.html?account=' + GetQueryString("account") + '&terms=' + terms + '&subject=' + subject + '&role=' + role + '&end=1'
                    }
                    ;
                    if (terms == 1) {
                        left.style.visibility = 'hidden'
                    }
                    if (GetQueryString('end') == 1) {
                        right.style.visibility = 'hidden'
                    }
                    if (role == 'student') {
                        paintChart(res)
                    } else if (role == 'teacher') {
                        paintChart1(res)
                    }
                } catch (e) {
                    alert("请重试");
                    ajaxbg.hide()
                }
            },
            error: function (e) {
                alert("请求失败")
            },
            complete: function (XMLHttpRequest, status) {
                if (status == 'timeout') {
                    ajaxTimeoutTest.abort();
                    alert("超时，请重试")
                }
            }
        })
    }

    function paintChart(data) {
        var classGrade = [];
        var studentGrade = [];
        var grade = [];
        var temp = [];
        for (var i = 0; i < data.scores.length; i++) {
            classGrade[i] = {label: "No." + (i + 1), y: data.classscores[i].scores};
            studentGrade[i] = {label: "No." + (i + 1), y: data.scores[i].score}
        }
        for (var i = 0; i < 9; i++) {
            if (i >= 3 && i < 6) {
                grades[i].innerHTML = data.analysis[subjects[i]].toFixed(0)
            } else if (i >= 0 && i < 3) {
                grades[i].innerHTML = (data.analysis[subjects[i]] * 100).toFixed(0) + '%'
            }
            ;
            grades[6].innerHTML = (data.lastRanking * 100).toFixed(0) + '%';
            grades[7].innerHTML = (data.thisRanking * 100).toFixed(0) + '%';
            grades[8].innerHTML = (data.goalRanking * 100).toFixed(0) + '%';
            if (i >= 0 && i <= 6) {
                temp[i] = data.analysis[subjects[i]]
            }
            temp[6] = data.lastRanking;
            temp[7] = data.thisRanking;
            temp[8] = data.goalRanking;
            grade[i] = {
                backgroundColor: "#dbdddd",
                title: {text: subjectsName[i]},
                data: [{
                    indexLabelLineColor: "#00afeb",
                    type: "doughnut",
                    dataPoints: [{y: temp[i] * 100, indexLabel: "", color: "#00afeb"}, {
                        y: 100 - temp[i] * 100,
                        indexLabel: "",
                        color: "#d2d2d2"
                    }]
                }]
            }
        }
        var chart = new CanvasJS.Chart("chartContainer", {
            colorSet: "#00aff0",
            backgroundColor: "#e6e7e7",
            title: {fontFamily: "tahoma", text: "班级平均成绩"},
            animationEnabled: true,
            axisY: {titleFontFamily: "arial", titleFontSize: 12, includeZero: false},
            toolTip: {shared: true},
            data: [{type: "line", name: "该科历次成绩", showInLegend: true, dataPoints: studentGrade}, {
                type: "line",
                name: "该科班级历次成绩",
                showInLegend: true,
                dataPoints: classGrade
            }],
            legend: {
                cursor: "pointer", itemclick: function (e) {
                    if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                        e.dataSeries.visible = false
                    } else {
                        e.dataSeries.visible = true
                    }
                    chart.render()
                }
            }
        });
        try {
            for (var i = 0; i < 9; i++) {
                new CanvasJS.Chart(subjects[i], grade[i]).render()
            }
        } catch (e) {
        }
        chart.render()
    }

    function paintChart1(data) {
        var classGrade = [];
        var grade = [];
        var temp = [];
        for (var i = 0; i < data.scores.length; i++) {
            classGrade[i] = {label: "No." + (i + 1), y: data.classscores[i].scores}
        }
        for (var i = 0; i < 9; i++) {
            if (i >= 3 && i < 6) {
                grades[i].innerHTML = data.analysis[subjects[i]].toFixed(0)
            } else if (i >= 0 && i < 3) {
                grades[i].innerHTML = (data.analysis[subjects[i]] * 100).toFixed(0) + '%'
            }
            ;
            grades[6].innerHTML = (data.lastRanking * 100).toFixed(0) + '%';
            grades[7].innerHTML = (data.thisRanking * 100).toFixed(0) + '%';
            grades[8].innerHTML = (data.goalRanking * 100).toFixed(0) + '%';
            if (i >= 0 && i <= 6) {
                temp[i] = data.analysis[subjects[i]]
            }
            temp[6] = data.lastRanking;
            temp[7] = data.thisRanking;
            temp[8] = data.goalRanking;
            grade[i] = {
                backgroundColor: "#dbdddd",
                title: {text: subjectsName[i]},
                data: [{
                    indexLabelLineColor: "#00afeb",
                    type: "doughnut",
                    dataPoints: [{y: temp[i] * 100, indexLabel: "", color: "#00afeb"}, {
                        y: 100 - temp[i] * 100,
                        indexLabel: "",
                        color: "#d2d2d2"
                    }]
                }]
            }
        }
        var chart = new CanvasJS.Chart("chartContainer", {
            colorSet: "#00aff0",
            backgroundColor: "#e6e7e7",
            title: {fontFamily: "tahoma", text: "班级平均成绩"},
            animationEnabled: true,
            axisY: {titleFontFamily: "arial", titleFontSize: 12, includeZero: false},
            toolTip: {shared: true},
            data: [{type: "line", name: "该科班级历次成绩", showInLegend: true, dataPoints: classGrade}],
            legend: {
                cursor: "pointer", itemclick: function (e) {
                    if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                        e.dataSeries.visible = false
                    } else {
                        e.dataSeries.visible = true
                    }
                    chart.render()
                }
            }
        });
        try {
            for (var i = 0; i < 9; i++) {
                new CanvasJS.Chart(subjects[i], grade[i]).render()
            }
        } catch (e) {
        }
        chart.render()
    }

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return unescape(r[2]);
        return null
    }

    function change() {
        switch (subject) {
            case'chinese':
                return '语文';
                break;
            case'math':
                return '数学';
                break;
            case'english':
                return '英语';
                break;
            case'physics':
                return '物理';
                break;
            case'chemistry':
                return '化学';
                break;
            case'biology':
                return '生物';
                break;
            case'polititcs':
                return '政治';
                break;
            case'history':
                return '历史';
                break;
            case'geography':
                return '地理';
                break
        }
    }

    left.onclick = function () {
        if (terms > 1) {
            terms--
        }
        window.location.href = 'subject.html?account=' + GetQueryString("account") + '&terms=' + terms + '&subject=' + GetQueryString("subject") + '&role=' + role
    };
    right.onclick = function () {
        if (terms < 5) {
            terms++
        }
        window.location.href = 'subject.html?account=' + GetQueryString("account") + '&terms=' + terms + '&subject=' + GetQueryString("subject") + '&role=' + role
    };
    back.onclick = function () {
        if (role == 'teacher') {
            window.location.href = 'teacher.html?account=' + account + '&terms=' + terms
        } else if (role == 'student') {
            window.location.href = 'student.html?account=' + account + '&terms=' + terms
        }
    }
});