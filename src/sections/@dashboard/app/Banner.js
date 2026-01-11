import React from 'react'
import { Typography, Box, Table, TableHead, TableRow, TableCell, CardMedia, TableBody, Button, Collapse, Stack, Paper, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadFile from './UploadFile';
import { getBanner } from 'src/api';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    flexGrow: 1,
}));
export default function Banner() {
    const [banners, setBanners] = useState([])
    const [update, setUpdate] = useState(false)
    const [open, setOpen] = useState(false)
    useEffect(() => {
        async function fetchData() {
            const banner = await getBanner()
            if (banner.results) {
                setBanners(banner.results)
            }
        }
        fetchData();

    }, [update])
    return (
        <>
            <Stack direction="row" spacing={2} mb={3}>

                <Typography variant="h4">Banner</Typography>
                <Button variant="text" onClick={() => { setOpen(!open) }}>{open ? 'Hide' : 'Show'}</Button>
            </Stack>
            <Box sx={{ minWidth: 800 }}>

                <Collapse in={open}>

                    <Box sx={{ width: '100%' }}>
                        <Stack
                            direction="row"
                            useflexgap
                            flexWrap="wrap"
                        >
                            {
                                banners.map((banner) => {
                                    return (
                                        <Item
                                            sx={{
                                                border: '1px dashed',
                                                padding: '15px',
                                                m: (theme) => theme.spacing(1)
                                            }}
                                            key={banner.id_bn}
                                        >
                                            <Box
                                                sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
                                            >
                                                <Stack
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    alignItems="baseline"
                                                    spacing={2}
                                                    sx={{ width: '100%' }}
                                                >
                                                    <Typography fontWeight={'bold'} pb={1}>{`Image ${banner.id_bn}`}</Typography>
                                                    <UploadFile id={banner.id_bn} update={update} setUpdate={setUpdate} />
                                                </Stack>
                                                <CardMedia
                                                    component="img"
                                                    sx={{ width: 350, textAlign: "center" }}
                                                    image={`https://api.mmsvn.com/read_image/${banner.link}`}
                                                    alt={banner.id_bn}
                                                />
                                            </Box>
                                        </Item>
                                    )
                                })
                            }
                        </Stack>
                    </Box>
                </Collapse>
            </Box>
        </>

    )
}
