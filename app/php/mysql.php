<?php
$host = '213.171.200.95';
$database = 'royalkeepers';
$user = 'rkUser1';
$password = '^N*&9fa@2';

$link = mysqli_connect($host, $user, $password, $database) or die("Error " . mysqli_error($link));

$company_name = htmlentities(mysqli_real_escape_string($link, $_POST['company_name']));
$company_info = htmlentities(mysqli_real_escape_string($link, $_POST['company_info']));
$city = htmlentities(mysqli_real_escape_string($link, $_POST['city']));
$email = htmlentities(mysqli_real_escape_string($link, $_POST['email']));
$phone = htmlentities(mysqli_real_escape_string($link, $_POST['phone']));
$website = htmlentities(mysqli_real_escape_string($link, $_POST['website']));

$main_email = htmlentities(mysqli_real_escape_string($link, $_POST['main-email']));
$password = htmlentities(mysqli_real_escape_string($link, $_POST['pass']));

$service_1 = '';
if($_POST['services-1']) {
	foreach ($_POST["services-1"] as $key => $value) {
		$service_1 .= $value . '; ';
	}
}
$service_1 = htmlentities(mysqli_real_escape_string($link, $service_1));

$service_2 = '';
if($_POST['services-2']) {
	foreach ($_POST["services-2"] as $key => $value) {
		$service_2 .= $value . '; ';
	}
}
$service_2 = htmlentities(mysqli_real_escape_string($link, $service_2));

$cities = '';
if($_POST['cities']) {
	foreach ($_POST["cities"] as $key => $value) {
		$cities .= $value . '; ';
	}
}
$cities = htmlentities(mysqli_real_escape_string($link, $cities));

$new_dir = str_replace(' ', '_', $company_name);
mkdir($_SERVER['DOCUMENT_ROOT'] . "/uploads/$new_dir", 0777);
$uploads_dir = $_SERVER['DOCUMENT_ROOT'] . "/uploads/$new_dir";
if($_FILES) {
	$company_logo = '';
	$company_pictures = '';

  foreach ($_FILES["company_logo"]["error"] as $key => $error) {
    if ($error == UPLOAD_ERR_OK) {
      $tmp_name = $_FILES["company_logo"]["tmp_name"][$key];
      $name = str_replace(' ', '_', $_FILES["company_logo"]["name"][$key]);
      move_uploaded_file($tmp_name, "$uploads_dir/$name");

			$company_logo .= $_SERVER['HTTP_ORIGIN'] . "/uploads/$name";
    }
  }
	foreach ($_FILES["company_pictures"]["error"] as $key => $error) {
    if ($error == UPLOAD_ERR_OK) {
      $tmp_name = $_FILES["company_pictures"]["tmp_name"][$key];
      $name = str_replace(' ', '_', $_FILES["company_pictures"]["name"][$key]);
      move_uploaded_file($tmp_name, "$uploads_dir/$name");

			$company_pictures .= $_SERVER['HTTP_ORIGIN'] . "/uploads/$name ";
    }
  }

	$company_logo = htmlentities(mysqli_real_escape_string($link, $company_logo));
	$company_pictures = htmlentities(mysqli_real_escape_string($link, $company_pictures));
}

$query = "INSERT INTO form VALUES(NULL, '$company_name', '$company_logo', '$company_pictures', '$company_info', '$service_1', '$service_2', '$cities', '$email', '$phone', '$website', '$main_email', '$password')";

print ($query);
$result = mysqli_query($link, $query) or die("Error " . mysqli_error($link));

mysqli_close($link);
