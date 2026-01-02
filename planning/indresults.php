<?php
include "usmsdefs.php";
include_once "$sitedb/database/classautoloader.php";
$noLocalNav = FALSE; // Change to TRUE to inhibit left and right navigation areas
$noRightNav = TRUE; // Change to TRUE to inhibit right navigation areas

include "$sitedb/database/timeconvert.php";
include_once "$sitedb/database/lmscutils.php";
include "$site/comp/meets/meetutils.php";
include_once "$sitedb/database/meetresultsutils.php";

$PageTitle = "USMS Individual Meet Results";
$PageTitleRelays = "USMS Relay Meet Results";

$SwimmerID = (isset($_GET["SwimmerID"]) ? $_GET["SwimmerID"] : "");
$LastName = (isset($_GET["LastName"]) ? $_GET["LastName"] : "");
$FirstName = (isset($_GET["FirstName"]) ? $_GET["FirstName"] : "");
$MI = (isset($_GET["MI"]) ? $_GET["MI"] : "");
$Sex = (isset($_GET["Sex"]) ? $_GET["Sex"] : "");

$srt = (isset($_GET["srt"]) ? $_GET["srt"] : "");
$showScratch = (isset($_GET["showScratch"]) ? $_GET["showScratch"] : "");
$noID = (isset($_GET["noID"]) ? $_GET["noID"] : "");
$CourseID = (isset($_GET["CourseID"]) ? $_GET["CourseID"] : "");
$Distance = (isset($_GET["Distance"]) ? $_GET["Distance"] : "");
$StrokeID = (isset($_GET["StrokeID"]) ? $_GET["StrokeID"] : "");
$lowage = (isset($_GET["lowage"]) ? $_GET["lowage"] : "");
$highage = (isset($_GET["highage"]) ? $_GET["highage"] : "");

$CoursePart = "";
$body = "";
$Name = "";
if ($pdoLink = \Database::GetInstance()->GetPDO())
{
    // EEEM-158 Add a way to block showing a member's swims "Results not available for this swimmer"
    // Returns false if we can display the results
    if (!HideResultsInfo($SwimmerID))
    {
        $SwimmerID = (isset($_GET["SwimmerID"]) ? $_GET["SwimmerID"] : "");
        if (($LastName and $FirstName) OR $SwimmerID)
        {
            $bindVariables = array();
            $where_clause = "EventResultsSwims.IndRelay = 'I' ";
            $where_clause_relays = "EventResultsSwims.IndRelay = 'R' ";
            if ($showScratch != "on")
            {
                $where_clause .= " AND (EventResultsSwims.EventStatus != 'SCR' AND EventResultsSwims.EventStatus != 'NS') ";
                $where_clause_relays .= " AND (EventResultsSwims.EventStatus != 'SCR' AND EventResultsSwims.EventStatus != 'NS') ";    
            }
            if ($SwimmerID)
            {
                $bindVariables[":swimmerid"] = $SwimmerID;
                $where_clause .= " AND EventResultsSwimmers.SwimmerID = :swimmerid ";
                $where_clause_relays .= " AND EventResultsRelaySwimmers.SwimmerID = :swimmerid ";
                $swimmer_sql = "
                    SELECT 
                        IF(HideMemberInfo = 1, 'Name', FirstName) AS FirstName, 
                        IF(HideMemberInfo = 1, '', MI) AS MI, 
                        IF(HideMemberInfo = 1, 'Unknown', LastName) AS LastName, 
                        HideMemberInfo
                    FROM People 
                    WHERE SwimmerID = :swimmerid";
                if (($swimmer_query = $pdoLink->prepare($swimmer_sql)) && ($swimmer_query->execute(array(':swimmerid' => $SwimmerID))))
                {
                    if ($swimmer = $swimmer_query->fetch(\PDO::FETCH_ASSOC))
                    {
                        $Name = htmlspecialchars($swimmer["FirstName"]) . " " . htmlspecialchars($swimmer["MI"]) . " " . htmlspecialchars($swimmer["LastName"]);
                        $PageTitle .= " for $Name";
                        $PageTitleRelays .= " for $Name";
                    }
                    else
                    {
                        $Name = "Unknown Swimmer";
                    }
                }
                else
                {
                    $Name = "Unknown Swimmer";
                }
            }
            elseif ($LastName AND $FirstName)
            {
                $Name = htmlspecialchars($FirstName) . " " . htmlspecialchars($MI) . " " . htmlspecialchars($LastName);
                $PageTitle .= " for $Name";
                $PageTitleRelays .= " for $Name";
                $bindVariables[":firstname"] = $FirstName;
                $bindVariables[":lastname"] = $LastName;
                $where_clause .= " AND EventResultsSwimmers.LastName = :lastname AND EventResultsSwimmers.FirstName = :firstname AND EventResultsSwimmers.CompetitorStatus != 'nonmember' AND People.HideMemberInfo != 1 ";
                $where_clause_relays .= " AND EventResultsRelaySwimmers.LastName = :lastname AND EventResultsSwimmers.FirstName = :firstname AND People.HideMemberInfo != 1 ";
                if ($noID)
                {
                    $where_clause .= " AND EventResultsSwimmers.SwimmerID = ''";
                    $where_clause_relays .= " AND EventResultsRelaySwimmers.SwimmerID = ''";
                }
                if ($MI)
                {
                    $bindVariables[":mi"] = $MI;
                    $where_clause .= " AND EventResultsSwimmers.MI = :mi";
                    $where_clause_relays .= " AND EventResultsSwimmers.MI = :mi";
                }
            }
             
            if ($CourseID)
            {
                $bindVariables[":courseid"] = $CourseID;
                $where_clause .= " AND Meets.CourseID = :courseid ";
                $where_clause_relays .= " AND Meets.CourseID = :courseid ";
                $course = new \Course($pdoLink, $CourseID);
                $CoursePart = " " . $course->CourseAbbr;
            }
            
            if ($Distance)
            {
                $bindVariables[":distance"] = $Distance;
                $where_clause .= " AND EventResultsSwims.Distance = :distance";
                $where_clause_relays .= " AND EventResultsSwims.Distance = :distance";
            }
            
            if ($StrokeID)
            {
                $bindVariables[":strokeid"] = $StrokeID;
                $where_clause .= " AND EventResultsSwims.StrokeID = :strokeid";
                $where_clause_relays .= " AND EventResultsSwims.StrokeID = :strokeid";
            }
            
            if ($lowage)
            {
                $bindVariables[":lowage"] = $lowage;
                $where_clause .= " AND EventResultsSwimmers.Age >= :lowage";
                $where_clause_relays .= " AND EventResultsRelaySwimmers.Age >= :lowage";
            }
            
            if ($highage)
            {
                $bindVariables[":highage"] = $highage;
                $where_clause .= " AND EventResultsSwimmers.Age <= :highage";
                $where_clause_relays .= " AND EventResultsRelaySwimmers.Age <= :highage";
            }
            
            // Set up body head text strings to be shown before the results of the queries
            if ($SwimmerID)
            {
                $IndBodyHead = "Below are all recorded individual$CoursePart results attributed to <a href=\"/people/" . htmlspecialchars($SwimmerID) . "\">$Name</a>.";
                $RelBodyHead = "Below are all recorded relay$CoursePart results attributed to <a href=\"/people/" . htmlspecialchars($SwimmerID) . "\">$Name</a>.";
                $mergedSwimmer_sql = "SELECT NewSwimmerID FROM People WHERE SwimmerID = :swimmerid";
                if (($mergedSwimmer_query = $pdoLink->prepare($mergedSwimmer_sql)) && ($mergedSwimmer_query->execute(array(":swimmerid" => $SwimmerID))))
                {
                    if ($mergedSwimmer = $mergedSwimmer_query->fetch(\PDO::FETCH_ASSOC))
                    {
                        if ($mergedSwimmer["NewSwimmerID"])
                        {
                            header("Location: http://" . $_SERVER['SERVER_NAME'] . htmlspecialchars($_SERVER['PHP_SELF']) . "?SwimmerID=" . $mergedSwimmer["NewSwimmerID"]);
                            exit;
                        }
                    }
                }
    
            }
            else
            {
                $IndBodyHead = "Below are all recorded individual$CoursePart results for $Name. <span style=\"color:red;\">Note that we are missing the registration number for any swims listed below in red. These swims may not appear in the <a href=\"toptimes.php\">event results rankings pages</a> as a result. Please be patient with our ongoing efforts to clean up this data, especially for older meets.  Meet Directors -- you can help by being sure to include full registration numbers with all meet results.</span>";
                $RelBodyHead = "Below are all recorded relay$CoursePart results for $Name. <span style=\"color:red;\">Note that we are missing the registration number for any swims listed below in red. These swims may not appear in the <a href=\"toptimes.php\">event results rankings pages</a> as a result. Please be patient with our ongoing efforts to clean up this data, especially for older meets.    Meet Directors -- you can help by being sure to include full registration numbers with all meet results.</span>";
            }
            
            if ($srt == "age")
            {
                $indOrderBy = "EventResultsSwimmers.Age DESC, EventResultsSwims.FixedTimeEventMinutes, EventResultsSwims.StrokeID, EventResultsSwims.Distance, DisplayOrder, EventResultsSwims.FinalTimeSec";
            }
            elseif ($srt == "time")
            {
                $indOrderBy = "EventResultsSwims.FixedTimeEventMinutes, EventResultsSwims.StrokeID, EventResultsSwims.Distance, DisplayOrder, EventResultsSwims.FinalTimeSec";
            }
            else
            {
                $indOrderBy = "EventResultsSwimmers.AgeGroupID DESC, EventResultsSwims.FixedTimeEventMinutes, EventResultsSwims.StrokeID, EventResultsSwims.Distance, DisplayOrder, EventResultsSwims.FinalTimeSec";
            }
            // Determine if Pool Not Measured Note is needed
            $sql = "SELECT
                            if (People.HideMemberInfo = 1, 'Name', EventResultsSwimmers.FirstName) AS FirstName, 
                            if (People.HideMemberInfo = 1, '', EventResultsSwimmers.MI) AS MI, 
                            if (People.HideMemberInfo = 1, 'Unknown', EventResultsSwimmers.LastName) AS LastName, 
                            EventResultsSwimmers.SwimmerID,
                            EventResultsSwimmers.TeamAbbr,
                            Meets.CourseID,
                            Courses.CourseName,
                            Courses.CourseChar,
                            Courses.CourseAbbr,
                            EventResultsSwimmers.CompetitorStatus,
                            EventResultsSwimmers.Sex,
                            EventResultsSwimmers.AgeGroupID,
                            AgeGroups.AgeGroup,
                            EventResultsSwimmers.Age,
                            Meets.MeetTitle,
                            Meets.MeetID,
                            Meets.StartDate,
                            Meets.PoolMeasured,
                            EventResultsSwims.SwimID,
                            EventResultsSwims.EventNumber,
                            EventResultsSwims.Heat,
                            EventResultsSwims.Lane,
                            EventResultsSwims.Round,
                            EventResultsSwims.SplitRefSwim,
                            Strokes.StrokeShortName,
                            EventResultsSwims.Distance,
                            EventResultsSwims.FinalTimeSec,
                            EventResultsSwims.Place,
                            EventResultsSwims.EventStatus, 
                            EventResultsSwims.FixedTimeEventMinutes,
                            People.HideMemberInfo,
                            COUNT(EventResultsSplits.SplitID) AS NumSplits,
                            IF (EventResultsSwims.FinalTimeSec='0.00', 1, 0) AS DisplayOrder
                        
                        FROM
                            EventResultsSwimmers
                            LEFT JOIN EventResultsSwimmersInSwims USING (CompetitorID)
                            LEFT JOIN People USING(SwimmerID)
                            LEFT JOIN EventResultsSwims ON EventResultsSwims.SwimID = EventResultsSwimmersInSwims.SwimID
                            LEFT JOIN Meets ON EventResultsSwimmers.MeetID = Meets.MeetID
                            LEFT JOIN Courses ON Courses.CourseID = Meets.CourseID
                            LEFT JOIN Strokes ON Strokes.StrokeID = EventResultsSwims.StrokeID
                            LEFT JOIN AgeGroups ON AgeGroups.AgeGroupID = EventResultsSwimmers.AgeGroupID
                            LEFT JOIN LMSCs ON EventResultsSwimmers.LMSCID = LMSCs.LMSCID
                            LEFT JOIN EventResultsSplits ON EventResultsSwims.SwimID = EventResultsSplits.SwimID
                        
                        WHERE ";
              $sql .= $where_clause;
              $count_sql = $sql;
              $count_sql .=  " AND Meets.PoolMeasured = '0' ";               
              $count_sql .=  " GROUP BY
                                    EventResultsSwims.SwimID
                               ORDER BY
                                    Meets.CourseID,
                                    $indOrderBy ";
             $NotMeasured = false;
             if (($count_query = $pdoLink->prepare($count_sql)) && ($count_query->execute($bindVariables)))
             {
                if ($count_query->rowCount() > 0) 
                {
                    $NotMeasured = true;
                }
            }
            //Main query for individual results
            $sql .=  " GROUP BY
                            EventResultsSwims.SwimID
                       ORDER BY
                            Meets.CourseID,
                            $indOrderBy ";
            if (($query = $pdoLink->prepare($sql)) && ($query->execute($bindVariables)))
            {
                if ($query->rowCount() > 0)
                {
                    $body .= "<p>$IndBodyHead</p>\n";
                    $PageTitle .= " (". $query->rowCount() ." swims)";
                    
                    // Add sort options
                    $body .= "<form method=\"get\" action=\"" . htmlspecialchars($_SERVER["PHP_SELF"]) . "\">\n";
                    $body .= "Sort results for each event by: ";
                    $body .= "<select name=\"srt\">\n";
                    $body .= "<option value=\"ageGrp\"" . (($srt == "ageGrp" OR !$srt) ? " selected=\"selected\"" : "") . ">Time, by age group</option>\n";
                    $body .= "<option value=\"age\"" . ($srt == "age" ? " selected=\"selected\"" : "") . ">Time, by age</option>\n";
                    $body .= "<option value=\"time\"" . ($srt == "time" ? " selected=\"selected\"" : "") . ">Time, independent of age</option>\n";
                    $body .= "</select>\n";
                    $body .= "<br />";
                    $body .= "Show SCR and NS swims: <input type=\"checkbox\" id=\"showScratch\" name=\"showScratch\" value=\"on\" ";
                    if ($showScratch == "on")
                    {
                        $body .= " checked=\"checked\" ";    
                    }
                    $body .= "/><br />";
                    $body .= "<input type=\"hidden\" name=\"SwimmerID\" value=\"$SwimmerID\" />";
                    $body .= "<input type=\"hidden\" name=\"FirstName\" value=\"$FirstName\" />";
                    $body .= "<input type=\"hidden\" name=\"MI\" value=\"$MI\" />";
                    $body .= "<input type=\"hidden\" name=\"LastName\" value=\"$LastName\" />";
                    $body .= "<input type=\"hidden\" name=\"Sex\" value=\"$Sex\" />";
                    $body .= "<input type=\"hidden\" name=\"StrokeID\" value=\"$StrokeID\" />";
                    $body .= "<input type=\"hidden\" name=\"Distance\" value=\"$Distance\" />";
                    $body .= "<input type=\"hidden\" name=\"CourseID\" value=\"$CourseID\" />";
                    $body .= "<input type=\"hidden\" name=\"lowage\" value=\"$lowage\" />";
                    $body .= "<input type=\"hidden\" name=\"highage\" value=\"$highage\" />";
                    $body .= "<input type=\"submit\" value=\"Update Display\" />\n";
                    $body .= "</form>\n";
            
                    $currentAgeGroupID = 0;
                    $currentCourseID = 0;
                    $currentAge = 0;
                    $currentStrokeShortName = "";
                    $currentDistance = 0;
                    $currentFixedTimeEventMinutes = 0;
                    $passnum = 0;
                    while ($record = $query->fetch(\PDO::FETCH_ASSOC))
                    {
                        // Create a header for a new course if found
                        if ($currentCourseID != $record["CourseID"])
                        {
                            if ($passnum)
                            {
                                $body .= "</table>\n\n";
                            }
                            $body .= "<h3 style=\"margin-top:15px;\">\n";
                            $passnum++;
                            $body .= "<a name=\"" . $record["CourseAbbr"] . "\"></a>" . $record["CourseName"] . " Results";
                            if (!$CourseID)
                            {
                                if ($record["CourseAbbr"] == "SCY")
                                {
                                    $body .= " [ <a href=\"#SCM\">SCM</a> | <a href=\"#LCM\">LCM</a> ]";
                                }
                                elseif ($record["CourseAbbr"] == "SCM")
                                {
                                    $body .= " [ <a href=\"#SCY\">SCY</a> | <a href=\"#LCM\">LCM</a> ]";
                                }
                                elseif ($record["CourseAbbr"] == "LCM")
                                {
                                    $body .= " [ <a href=\"#SCY\">SCY</a> | <a href=\"#SCM\">SCM</a> ]";
                                }
                            }
                            $body .= "</h3>\n";
                            $body .= "<table border=\"1\" cellspacing=\"0\" cellpadding=\"0\" class=\"indresults\">\n";
                            if ($srt == "time")
                            {
                                $body .= "<tr align=\"left\" valign=\"bottom\">\n";
                                $body .= "<th>&nbsp;Name&nbsp;</th>";
                                $body .= "<th>&nbsp;Date (MeetID)&nbsp;</th>";
                                $body .= "<th align=\"center\">&nbsp;Age&nbsp;</th>";
                                $body .= "<th align=\"center\">&nbsp;Club&nbsp;</th>";
                                $body .= "<th>&nbsp;Event&nbsp;</th>";
                                $body .= "<th align=\"center\">&nbsp;Heat/&nbsp;<br />&nbsp;Lane&nbsp;</th>";
                                $body .= "<th align=\"right\">&nbsp;Time&nbsp;</th>";
                                $body .= "<th align=\"right\">&nbsp;Place&nbsp;</th>\n";
                                $body .= "</tr>\n";
                            }
                            $currentAgeGroupID = 0;
                            $currentAge = 0;
                            $currentStrokeShortName = "";
                            $currentDistance = 0;
                        }
                        
                        // create a header row for a new age if found (and if sorting by age)
                        if ($srt == "age" AND $currentAge != $record["Age"])
                        {
                            $body .= "<tr align=\"left\" valign=\"top\">\n";
                            $body .= "<th colspan=\"8\" bgcolor=\"#DDDDDD\">&nbsp;" . $record["CourseAbbr"] . " Results for Age " . $record["Age"] . "&nbsp;</th>";
                            $body .= "</tr>\n";
                            $body .= "<tr align=\"left\" valign=\"bottom\">\n";
                            $body .= "<th>&nbsp;Name&nbsp;</th>";
                            $body .= "<th>&nbsp;Date (MeetID)&nbsp;</th>";
                            $body .= "<th align=\"center\">&nbsp;Age&nbsp;</th>";
                            $body .= "<th align=\"center\">&nbsp;Club&nbsp;</th>";
                            $body .= "<th>&nbsp;Event&nbsp;</th>";
                            $body .= "<th align=\"center\">&nbsp;Heat/&nbsp;<br />&nbsp;Lane&nbsp;</th>";
                            $body .= "<th align=\"right\">&nbsp;Time&nbsp;</th>";
                            $body .= "<th align=\"right\">&nbsp;Place&nbsp;</th>\n";
                            $body .= "</tr>\n";
                            $currentStrokeShortName = "";
                            $currentDistance = 0;
                        }
                        
                        // create a header row for a new age group if found (and if sorting by age group)
                        elseif ($srt != "time" AND $currentAgeGroupID != $record["AgeGroupID"])
                        {
                            $body .= "<tr align=\"left\" valign=\"top\">\n";
                            $body .= "<th colspan=\"8\" bgcolor=\"#DDDDDD\">&nbsp;" . $record["CourseAbbr"] . " Results for " . $record["AgeGroup"] . "&nbsp; Age Group</th>";
                            $body .= "</tr>\n";
                            $body .= "<tr align=\"left\" valign=\"bottom\">\n";
                            $body .= "<th>&nbsp;Name&nbsp;</th>";
                            $body .= "<th>&nbsp;Date (MeetID)&nbsp;</th>";
                            $body .= "<th align=\"center\">&nbsp;Age&nbsp;</th>";
                            $body .= "<th align=\"center\">&nbsp;Club&nbsp;</th>";
                            $body .= "<th>&nbsp;Event&nbsp;</th>";
                            $body .= "<th align=\"center\">&nbsp;Heat/&nbsp;<br />&nbsp;Lane&nbsp;</th>";
                            $body .= "<th align=\"right\">&nbsp;Time&nbsp;</th>";
                            $body .= "<th align=\"right\">&nbsp;Place&nbsp;</th>\n";
                            $body .= "</tr>\n";
                            $currentStrokeShortName = "";
                            $currentDistance = 0;
                        }
             
                        // add row for this swim
                        if (($record["FixedTimeEventMinutes"] == 0 and ($currentStrokeShortName != $record["StrokeShortName"] or $currentDistance != $record["Distance"])) or
                            ($record["FixedTimeEventMinutes"] != 0 and ($currentFixedTimeEventMinutes != $record["FixedTimeEventMinutes"])))
                        {
                            $rowBGcolor = " bgcolor=\"#EEEEEE\"";
                        }
                        else
                        {
                            $rowBGcolor = "";
                        }
                        
                        $body .= "<tr align=\"left\" valign=\"top\"$rowBGcolor>";
                        
                        if ($record["CompetitorStatus"] == "member")
                        {
                            $body .= "<td>&nbsp;" . $record["FirstName"] . " " . $record["MI"] . " " . $record["LastName"] . "&nbsp;</td>\n";
                        }
                        else
                        {
                            $body .= "<td style=\"color:red;\">&nbsp;" . $record["FirstName"] . " " . $record["MI"] . " " . $record["LastName"] . "&nbsp;</td>\n";
                        }
                        $body .= "<td>&nbsp;" . $record["StartDate"] . " (<a href=\"meet.php?MeetID=" . $record["MeetID"] . "\">" . $record["MeetID"] . "</a>)&nbsp;</td>\n";
                        $body .= "<td align=\"center\">&nbsp;" . $record["Age"] . "&nbsp;</td>\n";
                        $body .= "<td align=\"center\">&nbsp;" . $record["TeamAbbr"] . "&nbsp;</td>\n";
                        
                        // Add event name (different for fixed time events than "regular" events), and highlight first row of a new event with a bolded event name
                        if ($record["FixedTimeEventMinutes"] == 0) // "regular" event
                        { 
                            if ($currentStrokeShortName != $record["StrokeShortName"] or $currentDistance != $record["Distance"])
                            {
                                $body .= "<td bgcolor=\"#EEEEEE\">&nbsp;<strong>" . $record["Distance"] . " " . $record["StrokeShortName"] . "</strong>&nbsp;</td>\n";
                            }
                            else
                            {
                                $body .= "<td>&nbsp;" . $record["Distance"] . " " . $record["StrokeShortName"] . "&nbsp;</td>\n";
                            }
                        }
                        else // Fixed time event (e.g. 1 hour swim)
                        {
                            if ($record["FixedTimeEventMinutes"] % 60 == 0)
                            {
                                $fixedTimeEventDisplay = $record["FixedTimeEventMinutes"] / 60 . "-Hour Swim";
                            }
                            else
                            {
                                $fixedTimeEventDisplay = $record["FixedTimeEventMinutes"] . "-Min. Swim";
                            }
                            if ($currentFixedTimeEventMinutes != $record["FixedTimeEventMinutes"])
                            {
                                $body .= "<td bgcolor=\"#EEEEEE\">&nbsp;<strong>" . $fixedTimeEventDisplay . "</strong>&nbsp;</td>\n";
                            }
                            else
                            {
                                $body .= "<td>&nbsp;" . $fixedTimeEventDisplay . "&nbsp;</td>\n";
                            }
    
                        }
                        
                        // Display Heat/Lane if available (with link to heat results if Event # also available)
                        if ($record["Heat"] AND $record["Lane"])
                        {
                            if ($record["EventNumber"])
                            {
                                $body .= "<td align=\"center\">&nbsp;<a href=\"heat.php?MeetID=" . $record["MeetID"] . "&amp;Heat=" . $record["Heat"] . "&amp;Lane=" . $record["Lane"] . "&amp;Event=" . $record["EventNumber"] . "\">H" . $record["Heat"] . " / L" . $record["Lane"] . "</a>&nbsp;</td>\n";
                            }
                            else
                            {
                                $body .= "<td align=\"center\">&nbsp;H" . $record["Heat"] . " / L" . $record["Lane"] . "&nbsp;</td>\n";
                            }
                        }
                        else
                        {
                            $body .= "<td align=\"center\">&nbsp;N/A&nbsp;</td>\n";
                        }
                        
                        //Display time (with link to splits if available) and place column
                        if ($record["EventStatus"] != "OK")
                        {
                            $body .= "<td align=\"right\">&nbsp;" . $record["EventStatus"] . "&nbsp;</td>\n<td align=\"right\">&nbsp;--&nbsp;</td>";
                        }
                        else
                        {
                            if ($record["FixedTimeEventMinutes"] == 0)
                            {
                                if ($record["FinalTimeSec"] AND $record["FinalTimeSec"] != 0)
                                {
                                    if ($record["NumSplits"] == 0 AND $record["Round"] != "Split")
                                    {
                                        if ($record['PoolMeasured'] == '1')
                                        {
                                            $body .= "<td align=\"right\">&nbsp;" . TimeSecToDisplayTime($record["FinalTimeSec"]) . "&nbsp;</td>\n";
                                        }
                                        else
                                        {
                                            $body .= "<td align=\"right\">&nbsp;<span class=\"tip\" title=\"Pool Not Measured\">" . TimeSecToDisplayTime($record["FinalTimeSec"]) . "&nbsp;*</span></td>\n";
                                        }
                                    }
                                    else
                                    {
                                        if ($record['PoolMeasured'] == '1')
                                        {
                                            $body .= "<td align=\"right\">&nbsp;<a href=\"swim.php?s=" . $record["SwimID"] . "\">" . TimeSecToDisplayTime($record["FinalTimeSec"]) . "</a>&nbsp;</td>\n";
                                        }
                                        else
                                        {
                                            $body .= "<td align=\"right\">&nbsp;<span style=\"color:red\"><a style=\"color:red;\" title=\"Pool Not Measured\" href=\"swim.php?s=" . $record["SwimID"] . "\">" . TimeSecToDisplayTime($record["FinalTimeSec"]) . "</a>&nbsp;*</span></td>\n";
                                        }
                                    }
                                }
                                else
                                {
                                    $body .= "<td align=\"right\">&nbsp;--&nbsp;</td>\n";
                                }
                        }
                        else // Fixed-time event
                        {
                            $body .= "<td align=\"right\">&nbsp;" . number_format($record["Distance"]) . "&nbsp;</td>\n";
                        }
                        
                            if ($record["Place"])
                            {
                                $body .= "<td align=\"right\">&nbsp;" . $record["Place"] . "&nbsp;</td>\n";
                            }
                            elseif ($record["Round"] == "Split")
                            {
                                $body .= "<td align=\"right\">&nbsp;Split&nbsp;</td>\n";
                            }
                            elseif ($record["EventStatus"] == "OK")
                            {
                                $body .= "<td align=\"right\">&nbsp;--&nbsp;</td>\n";
                            }
                            else
                            {
                                $body .= "<td align=\"right\">&nbsp;" . $record["EventStatus"] . "&nbsp;</td>\n";
                            }
                        }
                        
                        $body .= "</tr>\n\n";
                        
                        // Save 'current' info
                        $currentAgeGroupID = $record["AgeGroupID"];
                        $currentAge = $record["Age"];
                        $currentCourseID = $record["CourseID"];
                        $currentStrokeShortName = $record["StrokeShortName"];
                        $currentDistance = $record["Distance"];
                        $currentFixedTimeEventMinutes = $record["FixedTimeEventMinutes"];
                    }
                    $body .= "</table>\n\n";
                    if ($NotMeasured)
                    {
                        $body .= "<br /><br /><p style=\"color:red;font-weight:bold;\">Times shown in red are from an event that was either held in a pool with a moveable bulkhead and the pool length must be certified in order to have results count towards top ten listings or event rankings OR it was held in a pool that did not meet the pool measurement standards or not all sanction/recognition standards were followed. Results from the event will not count towards the top ten list or event rankings.</p>\n"; 
                    }
                }
                
                else
                {
                    $body .= "<p>No individual meet results were found for $Name.</p>\n";
                }
            }
            
            else
            {
                $body .= "<p>An error occurred while trying to retrieve the individual meet results from the database. Please report this problem, along with what swimmer's results you were trying to view, to <a href=\"/admin/email.php?To=USMS+Webmaster&amp;a=webmaster\">the webmaster</a>.</p>\n";
            }
            
            // ============================================================================================
            // Relays: currently disabled
            // ============================================================================================
            
        }
        else
        {
            $body = "<p>Search for Individual Meet Results For:</p>\n" . BuildIndSearchForm();
        }
    }  // end if HideResultsInfo is false
    else  // if HideResultsInfo is true and we have to hide the results
    {
        // EEEM-158 Add a way to block showing a member's swims "Results not available for this swimmer"
        $body = "<p>Results not available for this swimmer.</p>\n";
        $body .= "<p>Search for Individual Meet Results For:</p>\n" . BuildIndSearchForm();    
    }
}

else
{
    $body = "<p>We are unable to connect to the database at this time. Please Try again later.</p>\n";
}

if ($Name OR $SwimmerID)
{
    $noLocalNav = FALSE;  // placeholder - set to TRUE if space is needed in display
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<?php include_once("$sitedb/database/layout/head_top.php"); ?>
<title><?php echo $PageTitle; ?></title>
<link rel="stylesheet" type="text/css" href="/usms.css" />
<script language="javascript" src="/menunav.js" type="text/JavaScript"></script>
<script language="javascript" src="/dw_cookies.js" type="text/JavaScript"></script>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<style type="text/css">
    a.tip, span.tip:visited, span.tip:active, span.tip
    {
        color: red;
        border-color: red;
        border-width: 0 0 .5px 0;
        border-style: dotted;
        text-decoration: none;
        border-bottom: none;
    }
</style>
<?php include_once("$sitedb/database/layout/head_bottom.php"); ?>
</head>
<body onload="init();">
<?php include "$site/bodytop_XML.php"; ?>

<div class="contentbox">
<div class="contentbar">
<strong><big>Event Results</big></strong>
</div>
<div class="contenttext">
<!-- CONTENT START -->
<h3><?php echo $PageTitle; ?></h3>
<?php 
  echo $body; 
?>
<!-- CONTENT END -->
</div>
</div>
<?php include "$site/bodybottom_XML.php"; ?>
</body>
</html>
