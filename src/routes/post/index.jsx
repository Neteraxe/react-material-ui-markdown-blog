import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import PostCard from '../../components/postCard';
import posts from '../../posts.json';
import React from 'react';
import styles from './styles';
import Typography from '@material-ui/core/Typography';
import ReactMarkdown from "react-markdown";
import CodeBlock from '../../utils/codeblock';

export default (props) => {
  const { match: { params } } = props;
  const { id: postId } = params;
  const classes = styles();

  const shuffle = (array) => {
    const newArray = [...array];
    for (let i = array.length - 1; i > 0; i--) {
      const n = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[n]] = [newArray[n], newArray[i]];
    }
    return newArray;
  };

  const post = posts.find((p) => p.id === postId);

  //await synchronization 同步 asynchronous 异步
  if (!post.markdown) {
    let rawFile = new XMLHttpRequest();
    rawFile.onreadystatechange = () => {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status === 0) {
          post.markdown = rawFile.responseText;
          if (!post.title)
            post.title = post.markdown.match(/\s.+/);
        }
      }
    };
    rawFile.open("GET", "/articles/".concat(post.id).concat(".md"), true);
    rawFile.send(null);
  }

  return (
    <React.Fragment>
      {post ? (
        <React.Fragment>
          <div className={classes.authorContainer}>
            <div>
              <Avatar className={classes.avatar}>{post.author[0]}</Avatar>
            </div>
            <div>
              <Typography variant='subtitle1' color='textPrimary'>{post.author}</Typography>
              <Typography variant='subtitle2' color='textSecondary' className={classes.date}>{new Date(post.date).toDateString()}</Typography>
            </div>
          </div>
          <script src="#" httponly="true" secure="true" samesite="Secure" />
          <img src={"//git.nwu.edu.cn/2018104171/web/raw/master/build".concat(post.thumbnail)} alt="post" className={classes.hero} />
          <ReactMarkdown
            source={post.markdown}
            renderers={{ code: CodeBlock }}
          />
          <div>
            {post.tags.map((tag) => (
              <Chip
                className={classes.chip}
                clickable
                component='a'
                href={`#${tag.toLowerCase()}`}
                key={tag}
                label={tag}
              />
            ))}
          </div>
        </React.Fragment>
      ) : (
          <Typography variant='h4' className={classes.notFound}>No post found :(</Typography>
        )}
      <Divider className={classes.divider} />
      <div>
        <Typography gutterBottom variant='h5'>
          Recommended Posts:
        </Typography>
        <Grid container className={classes.grid} spacing={2}>
          {shuffle(posts).slice(0, 2).map((post) => (
            <Grid item xs={12} key={post.id}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      </div>
      {console.clear()}
    </React.Fragment>
  )
}
