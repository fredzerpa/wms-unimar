import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import CancelIcon from "@mui/icons-material/Cancel"
import ClearAllIcon from "@mui/icons-material/ClearAll"
import CloseIcon from "@mui/icons-material/Close"
import DensityLargeIcon from "@mui/icons-material/DensityLarge"
import DensityMediumIcon from "@mui/icons-material/DensityMedium"
import DensitySmallIcon from "@mui/icons-material/DensitySmall"
import DragHandleIcon from "@mui/icons-material/DragHandle"
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed"
import EditIcon from "@mui/icons-material/Edit"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import FilterListIcon from "@mui/icons-material/FilterList"
import FilterListOffIcon from "@mui/icons-material/FilterListOff"
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import PushPinIcon from "@mui/icons-material/PushPin"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import SaveIcon from "@mui/icons-material/Save"
import SearchIcon from "@mui/icons-material/Search"
import SearchOffIcon from "@mui/icons-material/SearchOff"
import SortIcon from "@mui/icons-material/Sort"
import ViewColumnIcon from "@mui/icons-material/ViewColumn"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import colors from "assets/theme/base/colors"

export const MRT_Default_Icons = {
  ArrowDownwardIcon: (props) => (
    // color error on active state
    <ArrowDownwardIcon color="text" sx={{ color: `${colors.text.main}!important` }} {...props} />
  ),
  ArrowRightIcon: (props) => <ArrowRightIcon color="text" {...props} />,
  CancelIcon: (props) => <CancelIcon color="text" {...props} />,
  ClearAllIcon: (props) => <ClearAllIcon color="text" {...props} />,
  CloseIcon: (props) => <CloseIcon color="text" {...props} />,
  DensityLargeIcon: (props) => <DensityLargeIcon color="text" {...props} />,
  DensityMediumIcon: (props) => <DensityMediumIcon color="text" {...props} />,
  DensitySmallIcon: (props) => <DensitySmallIcon color="text" {...props} />,
  DragHandleIcon: (props) => <DragHandleIcon color="text" {...props} />,
  DynamicFeedIcon: (props) => <DynamicFeedIcon color="text" {...props} />,
  EditIcon: (props) => <EditIcon color="text" {...props} />,
  ExpandMoreIcon: (props) => <ExpandMoreIcon color="text" {...props} />,
  FilterAltIcon: (props) => <FilterAltIcon color="text" {...props} />,
  FilterListIcon: (props) => <FilterListIcon color="text" {...props} />,
  FilterListOffIcon: (props) => <FilterListOffIcon color="text" {...props} />,
  FullscreenExitIcon: (props) => <FullscreenExitIcon color="text" {...props} />,
  FullscreenIcon: (props) => <FullscreenIcon color="text" {...props} />,
  KeyboardDoubleArrowDownIcon: (props) => <KeyboardDoubleArrowDownIcon color="text" {...props} />,
  MoreHorizIcon: (props) => <MoreHorizIcon color="text" {...props} />,
  MoreVertIcon: (props) => <MoreVertIcon color="text" {...props} />,
  PushPinIcon: (props) => <PushPinIcon color="text" {...props} />,
  RestartAltIcon: (props) => <RestartAltIcon color="text" {...props} />,
  SaveIcon: (props) => <SaveIcon color="text" {...props} />,
  SearchIcon: (props) => <SearchIcon color="text" {...props} />,
  SearchOffIcon: (props) => <SearchOffIcon color="text" {...props} />,
  SortIcon: (props) => <SortIcon color="text" {...props} />,
  ViewColumnIcon: (props) => <ViewColumnIcon color="text" {...props} />,
  VisibilityOffIcon: (props) => <VisibilityOffIcon color="text" {...props} />
}
