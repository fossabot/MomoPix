import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid2 as Grid,
} from '@mui/material';
import { Link } from 'react-router-dom';

interface AlbumCardProperties {
  album: Album;
}

const AlbumCard = ({ album }: AlbumCardProperties) => {
  return (
    <Grid
      component='li'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        borderRadius: 8,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <Card>
        <Link to={`/album/${album.name}`}>
          <CardMedia
            component='div'
            sx={{
              height: 140,
              backgroundColor: album.thumbnail ? 'transparent' : '#e0e0e0',
              backgroundImage: album.thumbnail
                ? `url(${album.thumbnail})`
                : album.photos && album.photos.length > 0
                  ? `url(${album.photos.at(-1)?.url})`
                  : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px 8px 0 0',
            }}
          />
        </Link>
        <CardContent>
          <Typography
            variant='h6'
            gutterBottom
          >
            {album.name}
          </Typography>
          <Typography
            variant='body2'
            color='textSecondary'
          >
            照片数量: {album.photos.length || 0}
          </Typography>
          <Typography
            variant='body2'
            color='textSecondary'
          >
            创建时间: {new Date(album.createdAt).toLocaleDateString()}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size='small'
            color='primary'
            component={Link}
            to={`/album/${album.name}`}
          >
            查看详情
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default AlbumCard;
