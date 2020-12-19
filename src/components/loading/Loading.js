import React from 'react';
import Typography from '@material-ui/core/Typography';
import { CircularProgress } from '@material-ui/core';
import styles from './Loading.module.css';

const Loading = () => (
    <Typography className={styles.loadingTop} variant='h3'>
        Loading{'\t'}
        <CircularProgress color='secondary' />
    </Typography>
);

export default Loading;