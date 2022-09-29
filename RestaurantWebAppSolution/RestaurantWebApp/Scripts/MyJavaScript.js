$(document).ready(function () {
    ResetItems();
    loadItem();
    $("#txtQuantity").val('');
    $("#btnPayment").prop('disabled', true);
    $("#btnCheckOut").prop('disabled', true);
    $("#txtFinalTotal").val(parseFloat(0.00).toFixed(2));
    $("#Item").change(function () {
        loadItem();
    });

    $("input[type=text]").change(function () {
        CalculateSubTotal();
    });

    $("input[type=text]").keyup(function () {
        CalculateBalance();
    });

    $("#btnAddToList").click(function () {
        AddToTheItemList();
        FinalItemTotal();
    });

    $("#btnPayment").click(function () {
        FinalPayment();
    });

    $("#btnReset").click(function () { ResetItems(); ResetItemsDetails(); });
});

function FinalPayment() {
    var objOrderViewModel = {};
    var ListOrderDetailViewModel = new Array();
    objOrderViewModel.PaymentTypeId = $("#PaymentType").val();
    objOrderViewModel.CustomerId = $("#Customer").val();
    objOrderViewModel.FinalTotal = $("#txtFinalTotal").val();

    $("#tblRestaurantItemList").find("tr:gt(0)").each(function () {
        var objOrderDetailViewModel = {};
        objOrderDetailViewModel.ItemId = $(this).find("td:eq(0)").text();
        objOrderDetailViewModel.ItemName = $(this).find("td:eq(1)").text();
        objOrderDetailViewModel.Quantity = $(this).find("td:eq(3)").text();
        objOrderDetailViewModel.Total = $(this).find("td:eq(5)").text();
        objOrderDetailViewModel.Discount = $(this).find("td:eq(4)").text();
        objOrderDetailViewModel.UnitPrice = $(this).find("td:eq(2)").text();
        ListOrderDetailViewModel.push(objOrderDetailViewModel);
    });
    objOrderViewModel.listOrderDetailViewModel = ListOrderDetailViewModel;

    $.ajax({
        async: true,
        type: 'POST',
        dataType: 'JSON',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(objOrderViewModel),
        url: '/home/Index',
        success: function (data) { alert(data) },
        error: function () { alert('There is Some Problem to Add the data') }
    });

    ResetItems();
    ResetItemsDetails();
}

function ResetItemsDetails() {
    $('#divPayment').modal('hide');
    $("#tblRestaurantItemList").find("tr:gt(0)").each(function () {
        $(this).remove();
    });

    $("#txtFinalTotal").val(parseFloat(0.00).toFixed(2));
    $("#txtPaymentTotal").val(parseFloat(0.00).toFixed(2));
    $("#txtBalance").val(parseFloat(0.00).toFixed(2));
    $("#PaymentType").val(0); $("#Customer").val(0);

}


function AddToTheItemList() {
    var totalItemList = $("#tblRestaurantItemList");
    var UnitPrice = $("#txtUnitPrice").val();
    var Quantity = $("#txtQuantity").val();
    var Discount = $("#txtDiscount").val();
    var ItemId = $("#Item").val();
    var ItemName = $("#Item option:selected").text();
    var Total = (UnitPrice * Quantity) - Discount;


    var ItemList = "<tr><td hidden> " + ItemId + "</td><td>"
        + ItemName + "</td><td>" +
        parseFloat(UnitPrice).toFixed(2) + "</td><td>" +
        parseFloat(Quantity).toFixed(2) + "</td><td>" +
        parseFloat(Discount).toFixed(2) + "</td><td>"
        + parseFloat(Total).toFixed(2) + "</td> <td> <input type='button' value='Remove' name='remove' class='btn btn-danger' onclick='RemoveItem(this)'/>" + "</td></tr>";

    totalItemList.append(ItemList);
    ResetItems();
    EnableDisableCheckOut();
}

function EnableDisableCheckOut() {
    $("#btnCheckOut").prop('disabled', true);
    if ($('#tblRestaurantItemList tr').length > 1)
        $("#btnCheckOut").prop('disabled', false);
}


function ResetItems() {
    $("#txtQuantity").val('');
    $("#txtDiscount").val('');
    $("#Item").val(0);
    $("#txtTotal").val('');
    $("#btnPayment").prop('disabled', true);
    $("#btnCheckOut").prop('disabled', true);
    $("#txtUnitPrice").val('');
}

function RemoveItem(itemId) {
    $(itemId).closest('tr').remove();
    EnableDisableCheckOut();
}

function FinalItemTotal() {
    $("#txtFinalTotal").val("0.00");
    var FinalTotal = 0.00;
    $("#tblRestaurantItemList").find("tr:gt(0)").each(function () {
        var Total = $(this).find("td:eq(5)").text();
        FinalTotal += parseFloat(Total);
    });

    $("#txtFinalTotal").val(parseFloat(FinalTotal).toFixed(2));
    $("#txtPaymentTotal").val(parseFloat(FinalTotal).toFixed(2));
    $("#txtBalance").val(parseFloat(FinalTotal).toFixed(2));

}


function loadItem() {
    var itemId = $("#Item").val();
    GetItemUnitPrice(itemId);
}

function GetItemUnitPrice(itemId) {
    $.ajax({
        async: true,
        type: 'GET',
        dataType: 'JSON',
        contentType: 'application/json; charset=utf-8',
        data: { itemId: itemId },
        url: '/home/getItemUnitPrice',
        success: function (data) { $("#txtUnitPrice").val(data).toFixed(2) },
        error: function () { alert('There is some problem to get the unit price.') }
    });
}

function CalculateSubTotal() {
    var UnitPrice = $("#txtUnitPrice").val();
    var Quantity = $("#txtQuantity").val();
    var Discount = $("#txtDiscount").val();

    var Total = (UnitPrice * Quantity) - Discount;

    $("#txtTotal").val(parseFloat(Total).toFixed(2));

}

function CalculateBalance() {
    var FinalAmount = $("#txtPaymentTotal").val();
    var PaymentAmount = $("#txtPaymentAmount").val();
    var ReturnAmount = $("#txtReturnTotal").val();
    var BalanceAmount = parseFloat(FinalAmount) - parseFloat(PaymentAmount) + parseFloat(ReturnAmount);

    $("#txtBalance").val(parseFloat(BalanceAmount));

    if (BalanceAmount != 0) {
        $("#btnPayment").prop('disabled', true);
    }
    else {
        $("#btnPayment").prop('disabled', false);
    }
}