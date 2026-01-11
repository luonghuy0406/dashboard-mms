import React from 'react'
import { Typography, Box, Table, TableHead, TableRow, TableCell, CardMedia, TableBody, Button, Collapse, Stack, Paper, styled, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { getAboutUs, updateAboutUs } from 'src/api';
import EditorComponent from './EditorComponent';
import Swal from 'sweetalert2';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    flexGrow: 1,
}));

export default function AboutUs() {
    const [aboutUs, setAboutUs] = useState({})
    const [update, setUpdate] = useState(false)
    const [open, setOpen] = useState(false)
    const [image, setImage] = useState({
        image1: ``,
        image2: ``,
        image3: ``
    })
    const [imageFile, setImageFile] = useState({
        image1: ``,
        image2: ``,
        image3: ``
    })
    const [contentEn, setContentEn] = useState('')
    const [content, setContent] = useState('')
    useEffect(() => {
        async function fetchData() {
            const ab = await getAboutUs()
            if (ab.results) {
                setAboutUs(ab.results)
            }
        }
        fetchData();

    }, [update])
    useEffect(() => {
        if (Object.keys(aboutUs).length > 0) {
            setImage({
                image1: `https://api.mmsvn.com/read_image/${aboutUs.image1}`,
                image2: `https://api.mmsvn.com/read_image/${aboutUs.image2}`,
                image3: `https://api.mmsvn.com/read_image/${aboutUs.image3}`
            })
            setContentEn(aboutUs.content_en)
            setContent(aboutUs.content)
            let imageTemp = { ...imageFile }
            toDataURL(`https://api.mmsvn.com/read_image/${aboutUs.image1}`)
                .then(dataUrl => {
                    var fileData = dataURLtoFile(dataUrl, "imageName.jpg");
                    imageTemp = { ...imageTemp, image1: fileData }
                    toDataURL(`https://api.mmsvn.com/read_image/${aboutUs.image2}`)
                        .then(dataUrl => {
                            var fileData = dataURLtoFile(dataUrl, "imageName.jpg");
                            imageTemp = { ...imageTemp, image2: fileData }
                            toDataURL(`https://api.mmsvn.com/read_image/${aboutUs.image3}`)
                                .then(dataUrl => {
                                    var fileData = dataURLtoFile(dataUrl, "imageName.jpg");
                                    imageTemp = { ...imageTemp, image3: fileData }
                                    setImageFile({ ...imageTemp })
                                })
                        })
                })


        }

    }, [aboutUs])

    const handleImageUpload = (event, id) => {
        const file = event.target.files[0];
        setImage({ ...image, [id]: URL.createObjectURL(file) })

    };
    const listImage = ['image1', 'image2', 'image3']

    const handleUpdate = async (content_en, content, imageFile) => {
        let image1 = document.getElementById("file-upload-image1").files[0]
        let image2 = document.getElementById("file-upload-image2").files[0]
        let image3 = document.getElementById("file-upload-image3").files[0]

        if (!image1 && !image2 && !image3) {
            const response = await updateAboutUs(content, content_en, [], [], [])
            Swal.fire(
                response.results.status,
                response.results.msg,
                response.results.status
            )
        } else {
            const response = await updateAboutUs(content, content_en, image1 || imageFile.image1, image2 || imageFile.image2, image3 || imageFile.image3)
            Swal.fire(
                response.results.status,
                response.results.msg,
                response.results.status
            )
        }

    }
    return (
        <>
            <Stack direction="row" spacing={2} mb={3}>

                <Typography fontWeight={'bold'} variant="h4">About us</Typography>
                <Button variant="text" onClick={() => { setOpen(!open) }}>{open ? 'Hide' : 'Show'}</Button>
            </Stack>
            <Box sx={{ minWidth: 800 }}>

                <Collapse in={open}>

                    <Box sx={{ width: '100%' }}>
                        <Stack
                            direction="row"
                            useflexgap="true"
                            flexWrap="wrap"
                        >
                            {
                                listImage.map((id) => {
                                    return (
                                        <Item
                                            sx={{
                                                width: '30%',
                                                border: '1px dashed',
                                                padding: '15px',
                                                mr: (theme) => theme.spacing(2)
                                            }}
                                            key={id}
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
                                                    <Typography fontWeight={'bold'} pb={1}>{id}</Typography>
                                                    <div>
                                                        <input
                                                            accept="image/*"
                                                            id={"file-upload-" + id}
                                                            type="file"
                                                            style={{ display: 'none' }}
                                                            onChange={(e) => { handleImageUpload(e, id) }}
                                                        />

                                                        <label htmlFor={"file-upload-" + id}>
                                                            <Button variant="text" color="primary" component="span">
                                                                Replace image
                                                            </Button>
                                                        </label>
                                                    </div>
                                                </Stack>
                                                <CardMedia
                                                    component="img"
                                                    sx={{ width: 200, height: 200, textAlign: "center" }}
                                                    image={`${image[id]}`}
                                                    alt="about 1"
                                                />
                                            </Box>
                                        </Item>
                                    )
                                })
                            }
                            <Item sx={{ width: '100%', mt: (theme) => theme.spacing(2), mr: (theme) => theme.spacing(2) }}>
                                <Box
                                    sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}
                                >
                                    <Typography fontWeight={'bold'} pb={1}>Content EN</Typography>
                                    <EditorComponent des={contentEn} setDes={setContentEn} />
                                </Box>
                            </Item>
                            <Item sx={{ width: '100%', mt: (theme) => theme.spacing(2), mr: (theme) => theme.spacing(2) }}>
                                <Box
                                    sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}
                                >
                                    <Typography fontWeight={'bold'} pb={1}>Content VI</Typography>
                                    <EditorComponent des={content} setDes={setContent} />
                                </Box>
                            </Item>
                            <Item>
                                <Box
                                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                                >
                                    <Button variant="contained" onClick={() => { handleUpdate(contentEn, content, imageFile) }}>Update</Button>
                                </Box>
                            </Item>
                        </Stack>

                    </Box>
                </Collapse>
            </Box>
        </>

    )
}

const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    }))



function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}



