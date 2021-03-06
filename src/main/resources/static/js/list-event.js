window.onload = function() {
	populateEvents();
	configureInfiniteScroll();
	configureInfiniteScrollMobile();
	setFilter();
};

const url = "/events/rest/list";
var page = 0;
var filter = 0;
var name = "";

function populateEvents() {
	$.getJSON(url + "?name=" + name + "&label=" + filter + "&page=" + page,
			function(data) {
				$('#load').hide();
				if (data.length > 0) {
					$.each(data, function(key, val) {

						var item = $("#item-event-default").html();

						item = item.replace(/{ID}/g, val.id);
						item = item.replace(/{NAME}/g, val.name);
						item = item.replace(/{IMG}/g, "/events/uploads/"
								+ val.img);
						item = item.replace(/{AMOUNT}/g,
								currencyFormat(val.amount));
						item = item.replace(/{DATE}/g, moment(val.createAt)
								.locale('es').format('LL'));
						item = item.replace(/{LABEL}/g, val.label.name);
						item = item.replace(/{COLOR}/g, val.label.color);

						$("#list-events").append(item);

					});
				} else {
					page = -1;
					$('#nomore').show();
				}
			});
}

function configureInfiniteScroll() {
	var win = $(window);
	win.scroll(function() {
		if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2) {
			if (page >= 0) {
				$('#load').show();
				page++;
				populateEvents();
			}
		}
	});
}


function search() {
	var input = document.getElementById("search");
	name = input.value;
	resetList();
}

function setFilter() {
	$("select#filter").change(function() {
		window.filter = $(this).children("option:selected").val();
		resetList();
	});
}

function resetList() {
	$('#nomore').hide();
	page = 0;
	$("#list-events").empty();
	populateEvents();
}

function currencyFormat(num) {
	return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
