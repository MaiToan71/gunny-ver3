var ViewModel = function () {
    var self = this;
    self.convertToKoObject = function (data) {
        var newObj = ko.mapping.fromJS(data);
        return newObj;
    }
    self.convertToJson = function (item) {
        if (item == null || item == "") {
            return [];
        } else {
            return JSON.parse(item);
        }
    };
    self.hours = ko.observableArray();
    self.getNumberOfDayById = function () {
        var pathname = window.location.pathname;
        var id = pathname.split('/')[pathname.split('/').length - 1]
        $.ajax({
            url: "/api/Date/" + id,
            type: 'get',
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {
                self.hours([])
                $('#date').val(data[0].Date);
                if (data[0].NumberOfTimes.length == 0) {
                    for (var i = 0; i < 1440; i++) {
                      /*  var text = '';
                        text = i
                        if (i < 10) {
                            text = '0' + i
                        }*/
                        var obj = {
                            ID:0,
                            STT: i + 1,
                            DateId: id,
                            Name: time_convert(i),
                            InputNumber: 0,
                            CardinalNumber: time_convert(i).split(':').join('')
                        }
                        self.hours.push(self.convertToKoObject(obj));
                    }
                } else {
                    $.each(data[0].NumberOfTimes, function (i, item) {
                        var obj = {
                            ID: item.Id,
                            STT: i + 1,
                            DateId: id,
                            Name: item.Name,
                            InputNumber: item.InputNumber,
                            CardinalNumber: item.Name.split(':').join('')
                        }
                        self.hours.push(self.convertToKoObject(obj));
                    })
                }
                console.log(self.hours())
            },
            error: function (error) {
                console.log('fail');
            }
        });
    }
    self.update = function () {
        bootbox.confirm({
            message: "Bạn có muốn cập nhật chứ?",
            buttons: {
                confirm: {
                    label: 'Đồng ý',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'Hủy bỏ',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    $('#loadding').modal('show')

                    var array = [];
                    $.each(self.hours(), function (ex, item) {
                        var o = {
                            ID: item.ID(),
                            Name: item.Name(),
                            DateId: item.DateId(),
                            InputNumber: item.InputNumber(),
                            CardinalNumber: item.CardinalNumber()
                        }
                        array.push(o);
                    }
                    )
                    $.ajax({
                        url: "/api/Date/edit/" + array[0].DateId,
                        type: 'post',
                        contentType: 'application/json',
                        dataType: 'json',
                        data: JSON.stringify({
                            Date: $('#date').val(),
                            ID: array[0].DateId,
                            Lists: array
                        }),
                        success: function (data) {
                            $('#loadding').modal('hide')
                            self.getNumberOfDayById()
                            toastr.success("Bạn đã thêm mới một trường dữ liệu", "Thành công!");
                        },
                        error: function (error) {
                            console.log('fail');
                        }
                    });
                }
            }
        });
       

    }

    function time_convert(num) {
        const hours = Math.floor(num / 60);
        var hours_text = hours
        if (hours < 10) {
            hours_text = `0${hours}`
        }
        const minutes = num % 60;
        var minutes_text = minutes
        if (Number(minutes) < 10) {
            minutes_text = `0${minutes}`;
        }
       
        return `${hours_text}:${minutes_text}`;
    }
}
$(function () {
    var viewModel = new ViewModel();
    viewModel.getNumberOfDayById();
    ko.applyBindings(viewModel, document.getElementById('edit-date'));
});