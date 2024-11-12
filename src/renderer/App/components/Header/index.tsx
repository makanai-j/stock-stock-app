import SsidChartOutlinedIcon from '@mui/icons-material/SsidChartOutlined'
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined'
import FeaturedPlayListOutlinedIcon from '@mui/icons-material/FeaturedPlayListOutlined'
import './index.css'
import { IconButton } from '@mui/material'
import { Link } from 'react-router-dom'

export const Header = () => {
  return (
    <div className="app-header">
      <header>
        <h1>stock&nbsp;stock</h1>
        <ul>
          <li>
            <Link to={'/'}>
              <HeaderButton>
                <SsidChartOutlinedIcon fontSize="inherit" />
              </HeaderButton>
            </Link>
          </li>
          <li>
            <Link to={'/history'}>
              <HeaderButton>
                <FeaturedPlayListOutlinedIcon fontSize="inherit" />
              </HeaderButton>
            </Link>
          </li>
          <li>
            <Link to={'/input'}>
              <HeaderButton>
                <PlaylistAddOutlinedIcon fontSize="inherit" />
              </HeaderButton>
            </Link>
          </li>
        </ul>
      </header>
    </div>
  )
}

const HeaderButton = ({ children }: { children: any }) => {
  return (
    <IconButton
      size="small"
      sx={{
        color: '#ccf',
      }}
    >
      {children}
    </IconButton>
  )
}
