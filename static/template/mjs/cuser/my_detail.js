/**
 * Created by owner-pc on 9/5/15.
 */
$(function(){
    var uploader = new plupload.Uploader({
        runtimes : 'html5,flash,silverlight,html4',
        browse_button : 'change_image', // you can pass in id...
		//container: $('container'), // ... or DOM Element itself
		max_file_size : '10mb',
		// Fake server response here
		// url : '../upload.php',
		url: "/data/user/image/upload/",
		flash_swf_url : '/static/js/plupupload/Moxie.swf',
		silverlight_xap_url : '//static/js/plupupload/Moxie.xap',
        multi_selection: false,
		filters : [
			{title : "Image files", extensions : "jpg,gif,png"}
		],
		init: {
            FilesAdded : function(up, file){
                uploader.start();
            },
            FileUploaded: function (up, file, response) {
                response = $.parseJSON(response.response);
                console.log(response);
                console.log(response.success);

                if(check_action_result(response)){
                    return;
                }

                if(!response.success){
                    alert(response.reason);
                    return;
                }

                $("#head_portrait_img").attr("src", response.image);
                $("#head_portrait").val(response.image);
            },

			Error: function(up, err) {
                alert(err.message);
			}
		}
    });
    uploader.init();
});