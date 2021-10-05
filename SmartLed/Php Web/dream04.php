<!doctype html>
<?php
$servername="localhost";
$username="root";
$password="";
$dbname="nimabi";
$light_id = "";
$brightness = "";
$switch = "";
$result = "";

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
	try{
		$conn=mysqli_connect($servername,$username,$password,$dbname);
	}catch(MySQLi_Sql_Exception $ex){
		echo("error in connecting");
	}

function getData()
{
    $data = array();
    $data[0] = $_POST['light_id'];
    $data[1] = $_POST['brightness'];
    $data[2] = $_POST['switch'];
    return $data;
}

// search
if(isset($_POST['search']))
{
	$info= getData();
	$search_query="SELECT * FROM `light` WHERE light_id='$info[0]'";
	$search_result=mysqli_query($conn,$search_query);
		if($search_result)
		{
			if(mysqli_num_rows($search_result))
			{
				 while($rows=mysqli_fetch_array($search_result))
				 {
					 $light_id= $rows['light_id'];
					 $brightness= $rows['brightness'];
					 $switch= $rows['switch'];
				 }
			}else{
				$result="no data are availible";
			//	echo("no data are available");
			}
		}else{
			$result="result error";
		//	echo("result error"); 
		}
}

//update brightness
if(isset($_POST['update'])){
	$info =getData();
	$update_query="UPDATE `light` SET `brightness`='$info[1]' WHERE light_id ='$info[0]'";
	try{
		$update_result=mysqli_query($conn, $update_query);
		if($update_result)
		{
			if(mysqli_affected_rows($conn)>0){
				$result="date update successfully";
				//echo("data update successfully");
			}else{
				$result="data not updated";
				//echo("data not updated");
			}
		}
	}catch(Exception $ex){
		echo("error in update".$ex->getMessage());
          }
}

// Set normal mode
if(isset($_POST['normal'])){
	$info =getData();
	$update_query="UPDATE `light` SET `switch`='NOR' WHERE light_id ='$info[0]'";
	try{
		$update_result=mysqli_query($conn, $update_query);
		if($update_result)
		{
			if(mysqli_affected_rows($conn)>0){
				$result="date update successfully";
				//echo("data update successfully");
			}else{
				$result="data not updated";
				//echo("data not updated");
			}
		}
	}catch(Exception $ex){
		echo("error in update".$ex->getMessage());
          }
}

// Force light on

if(isset($_POST['forceon'])){
	$info =getData();
	$update_query="UPDATE `light` SET `switch`='FON' WHERE light_id ='$info[0]'";
	try{
		$update_result=mysqli_query($conn, $update_query);
		if($update_result)
		{
			if(mysqli_affected_rows($conn)>0){
				$result="date update successfully";
				//echo("data update successfully");
			}else{
				$result="data not updated";
				//echo("data not updated");
			}
		}
	}catch(Exception $ex){
		echo("error in update".$ex->getMessage());
          }
}

// Force light off

if(isset($_POST['forceoff'])){
	$info =getData();
	$update_query="UPDATE `light` SET `switch`='FOF' WHERE light_id ='$info[0]'";
	try{
		$update_result=mysqli_query($conn, $update_query);
		if($update_result)
		{
			if(mysqli_affected_rows($conn)>0){
				$result="date update successfully";
				//echo("data update successfully");
			}else{
				$result="data not updated";
				//echo("data not updated");
			}
		}
	}catch(Exception $ex){
		echo("error in update".$ex->getMessage());
          }
}


?>

<html>
<head>
<meta charset="utf-8">
<title>Room Light Management</title>
</head>
<body background="rsz_1rsz_1rsz_1winthrophall.jpg">
<form method="post" action="dream04.php">
   	<br>
    <center><font size="+3" color="#E9E819">UWA Light Management</font></center>
    
	<table align="center">
	<tr>
	<td><font color="#E9E819">Light ID:</font></td>
	<td><input type="number" name="light_id" placeholder="light ID num" value="<?php echo($light_id);?>"></td><br><br>
	</tr>
	
	<tr>
	<td><font color="#E9E819">Brightness:</font></td>
	<td><input type="number" name="brightness" placeholder="brightness in % " value="<?php echo($brightness);?>"></td><br><br>
	</tr>
	
	<tr>
	<td><font color="#E9E819">Switch Status:</font></td>
	<td><input type="text" name="switch" placeholder="switch status" value="<?php echo($switch);?>"></td><br><br>
	<tr>
	<tr>
	<td></td>
	<td><input type="text" name="Restult" placeholder="Operation result" value="<?php echo($result);?>"></td><br><br>
	<tr>
	<tr>
	<td></td>
	<td>
	<div>
		<input type="submit" name="update" value="update">
		<input type="submit" name="search" value="search">
		<input type="submit" name="forceon" value="forceon">
		<input type="submit" name="normal" value="normal">
		<input type="submit" name="forceoff" value="forceoff">

	</div>
	</td>
	</tr>	
	
	</table>
	</form>
</body>
</html>