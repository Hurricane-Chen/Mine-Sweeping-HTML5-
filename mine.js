
var sweepingboard = function(id) {
    this.dom = document.getElementById(id);
    this.ctx = this.dom.getContext("2d");
    this.a_w = 56;
    this.board_width = 10;
    this.board_array = [];
    this.showd_board = [];
    this.open_number = 0;
}

sweepingboard.prototype = {

    init : function() {
        this.draw();
        this.init_random_board();

        var domTop = this.dom.offsetTop,domLeft = this.dom.offsetLeft, self=this;

        this.dom.onclick = function(e) {
            var _x = e.pageX - domLeft - 30,_y = e.pageY - domTop - 30;
            var i = Math.floor(_x / self.a_w), j = Math.floor(_y / self.a_w);
            console.log(i, j);
            self.open(i, j);
            if (self.is_win()) {
                alert("恭喜扫雷成功!");
                location.replace("./index.html");
            }
        }

        this.dom.oncontextmenu = function(e) {
            var _x = e.pageX - domLeft - 30, _y = e.pageY - domTop - 30;
            var i = Math.floor(_x / self.a_w), j = Math.floor(_y / self.a_w);
            console.log(i, j);
            if (self.showd_board[i][j] == -2) self.remove_star(i, j);
            else self.star(i, j);
        }
    },

    init_random_board : function() {
        // 0 表示没有雷， 1 表示有雷
        for (var i = 0; i < 10; i++) {
            this.board_array[i] = [];
            this.showd_board[i] = [];
            for (var j = 0; j < 10; j++) {
                this.board_array[i][j] = 0;
                // showd_board为用户可视的数组。默认-1代表此时用户不可见
                this.showd_board[i][j] = -1;
            }
            var r_index = Math.round(Math.random() * 9);
            this.board_array[i][r_index] = 1;
        }
        console.log(this.board_array);
    },

    is_win : function() {
        if (this.open_number == this.board_width * 10 - 10) return true;
        return false;
    },

    draw : function() {
        var ctx = this.ctx;
        ctx.clearRect(0, 0, 620, 620);
        for (var i = 0; i <= this.board_width; i++) {
            ctx.beginPath();
            ctx.moveTo(30, 30 + this.a_w * i);
            ctx.lineTo(590, 30 + this.a_w * i);
            ctx.moveTo(30 + this.a_w * i, 30);
            ctx.lineTo(30 + this.a_w * i, 590);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#000";
            ctx.stroke();
        }
    },

    remove_star : function(i, j) {
        ctx = this.ctx;
        ctx.fillStyle = "#FFF";
        this.showd_board[i][j] = -1;
        ctx.fillRect(30 + i * this.a_w, 30 + j * this.a_w, this.a_w, this.a_w);
        ctx.stroke();
        return;
    },

    star : function(i, j) {
        if (i < 0 || j < 0 || i > 9 || j > 9) return;
        var ctx = this.ctx;
        if (this.showd_board[i][j] >= 0) return;
        ctx.fillStyle = "#FF4500";
        ctx.fillRect(30 + i * this.a_w, 30 + j * this.a_w, this.a_w, this.a_w);
        ctx.stroke();
        this.showd_board[i][j] = -2;
    },

    open : function(i, j) {
        if (i > 9 || j > 9 || i < 0 || j < 0) return;
        if (this.showd_board[i][j] != -1) return;
        var ctx = this.ctx;
        if (this.board_array[i][j] === 1) {
            ctx.fillStyle = "#000";
            ctx.fillRect(30 + i * this.a_w, 30 + j * this.a_w, 30 + (i + 1) * this.a_w, 30 + (j + 1) * this.a_w);
            ctx.stroke();
            alert("你触雷了！");
            location.replace("./index.html");
        }
        this.open_number += 1;
        ctx.fillStyle = "#EEDFCC";
        ctx.fillRect(30 + i * this.a_w, 30 + j * this.a_w, this.a_w, this.a_w);
        var neibor_sum = 0;
        // 检测方格附近有多少个雷
        if (i != 0) {
            if (this.board_array[i-1][j] == 1) {
                neibor_sum += 1;
            }
        }
        if (j != 0) {
            if (this.board_array[i][j-1] == 1) {
                neibor_sum += 1;
            }
        }
        if (i != 0 && j != 0) {
            if (this.board_array[i-1][j-1] == 1) {
                neibor_sum += 1;
            }
        }
        if (i != 0 && j < 9) {
            if (this.board_array[i-1][j+1] == 1) {
                neibor_sum += 1;
            }
        }
        if (i < 9 && j != 0) {
            if (this.board_array[i+1][j-1] == 1) {
                neibor_sum += 1;
            }
        }

        if (i < 9) {
            if (this.board_array[i+1][j] == 1) {
                neibor_sum += 1;
            }
        }
        if (j < 9) {
            if (this.board_array[i][j+1] == 1) {
                neibor_sum += 1;
            }
        }
        if (i < 9 && j < 9) {
            if (this.board_array[i+1][j+1] == 1) {
                neibor_sum += 1;
            }
        }

        this.showd_board[i][j] = neibor_sum;

        if (neibor_sum == 0) {
            this.open(i+1, j);
            this.open(i, j+1);
            this.open(i-1, j);
            this.open(i, j-1);
            this.open(i+1, j-1);
            this.open(i+1, j+1);
            this.open(i-1, j+1);
            this.open(i-1, j-1);
        }
        else {
            ctx.font="20px Georgia";
            ctx.fillStyle = "#000";
            ctx.fillText(neibor_sum.toString(), 60 + i * this.a_w, 60 + j * this.a_w);
        }
    },

    random_open : function() {
        var i = Math.floor(Math.random() * 10), j = Math.floor(Math.random() * 10);
        if (this.showd_board[i][j] == -1) {
            this.open(i, j);
            return;
        }
        else {
            this.random_open();
        }
    },

    ai_move : function() {
        if (this.is_win()) {
            alert("机器人君帮您把雷扫完了Orz");
            location.replace("./index.html");
        }
        if (this.open_number == 0) {
            this.random_open();
        } else {
            var val = this.step_probability();
            if (val === false) this.random_open();
        }
    },

    step_probability : function() {
        var ans = [];
        // 初始化可能性数组
        for (var i = 0; i < 10; i++) {
            ans[i] = [];
            for (var j = 0; j < 10; j++) {
                ans[i][j] = 0;
                if (this.showd_board[i][j] )
                var neibor_sum = 0;
                var flag = 0;
                if (i != 0) {
                    if (this.showd_board[i-1][j] == -1) {
                        neibor_sum += 1;
                    }
                    if (this.showd_board[i-1][j] == -2) {
                        neibor_sum += 1;
                        flag += 1;
                    }
                }
                if (j != 0) {
                    if (this.showd_board[i][j-1] == -1) {
                        neibor_sum += 1;
                    }
                    if (this.showd_board[i][j-1] == -2) {
                        neibor_sum += 1;
                        flag += 1;
                    }
                }
                if (i != 0 && j != 0) {
                    if (this.showd_board[i-1][j-1] == -1) {
                        neibor_sum += 1;
                    }
                    if (this.showd_board[i-1][j-1] == -2) {
                        neibor_sum += 1;
                        flag += 1;
                    }
                }
                if (i != 0 && j < 9) {
                    if (this.showd_board[i-1][j+1] == -1) {
                        neibor_sum += 1;
                    }
                    if (this.showd_board[i-1][j+1] == -2) {
                        neibor_sum += 1;
                        flag += 1;
                    }
                }
                if (i < 9 && j != 0) {
                    if (this.showd_board[i+1][j-1] == -1) {
                        neibor_sum += 1;
                    }
                    if (this.showd_board[i+1][j-1] == -2) {
                        neibor_sum += 1;
                        flag += 1;
                    }
                }

                if (i < 9) {
                    if (this.showd_board[i+1][j] == -1) {
                        neibor_sum += 1;
                    }
                    if (this.showd_board[i+1][j] == -2) {
                        neibor_sum += 1;
                        flag += 1;
                    }
                }
                if (j < 9) {
                    if (this.showd_board[i][j+1] == -1) {
                        neibor_sum += 1;
                    }
                    if (this.showd_board[i][j+1] == -2) {
                        neibor_sum += 1;
                        flag += 1;
                    }
                }
                if (i < 9 && j < 9) {
                    if (this.showd_board[i+1][j+1] == -1) {
                        neibor_sum += 1;
                    }
                    if (this.showd_board[i+1][j+1] == -2) {
                        neibor_sum += 1;
                        flag += 1;
                    }
                }

                var is_moved = false;

                if (neibor_sum === this.showd_board[i][j]) {
                    console.log(neibor_sum);
                    this.star(i+1, j);
                    this.star(i, j+1);
                    this.star(i-1, j);
                    this.star(i, j-1);
                    this.star(i+1, j-1);
                    this.star(i+1, j+1);
                    this.star(i-1, j+1);
                    this.star(i-1, j-1);
                    is_moved = true;
                } else if (flag === this.showd_board[i][j]) {
                    this.open(i+1, j);
                    this.open(i, j+1);
                    this.open(i-1, j);
                    this.open(i, j-1);
                    this.open(i+1, j-1);
                    this.open(i+1, j+1);
                    this.open(i-1, j+1);
                    this.open(i-1, j-1);
                    is_moved = true;
                }
            }
        }
        return is_moved;
    }
}

// 禁用鼠标右键弹出菜单
document.body.onselectstart=document.body.oncontextmenu=function(){ return false;}

var mytest = new sweepingboard("board");
mytest.init();

function auto_move() {
    mytest.ai_move();
}
