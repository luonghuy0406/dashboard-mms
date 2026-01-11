import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Button, Container, Stack, Typography, TextField, Box, Card, CardMedia, FormHelperText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostById, updatePost, deletePost } from 'src/api';
import { useEffect, useState } from 'react';
import { EditorComponent } from 'src/sections/@dashboard/products';
import Swal from 'sweetalert2';

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('')
    const [title_en, setTitleEN] = useState('')
    const [content, setContent] = useState('')
    const [content_en, setContentEN] = useState('')
    const [image, setImage] = useState('')
    useEffect(() => {
        async function fetchData() {
            const postLists = await getPostById(id)
            if (postLists.results) {
                const post = postLists.results
                setTitle(post.name)
                setTitleEN(post.name_en)
                setContent(post.content)
                setContentEN(post.content_en)
                setImage(`https://api.mmsvn.com/read_image/${post.image}`)
            }
        }
        fetchData();

    }, [id])

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImage(URL.createObjectURL(file))

    };

    const handleEditPost = async (id, name, name_en, content, content_en) => {
        if (name && name_en) {
            const image = document.getElementById("file-upload-edit-post-" + id).files[0] || []
            const response = await updatePost(id, name, name_en, content, content_en, image)
            Swal.fire(
                response.results.status,
                response.results.msg,
                response.results.status
            )
            if (response.results.status == 'success') {
                navigate('/dashboard/news', { replace: true });
            }
        }
    }

    const handleDeletePost = async (id) => {
        Swal.fire({
            text: `Are you sure you want to delete post?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deletePost(id)
                Swal.fire(
                    response.results.status,
                    response.results.msg,
                    response.results.status
                )
                if (response.results.status == 'success') {
                    navigate('/dashboard/news', { replace: true });
                }
            }
        })

    }
    return (
        <>
            <Helmet>
                <title> Dashboard: Edit post | MEKONG MARINE SUPPLY CO., LTD </title>
            </Helmet>

            <Container maxWidth={'xl'}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Edit post {id}
                    </Typography>
                </Stack>

                <Stack mb={5}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Post title EN
                        </Typography>
                        <TextField
                            variant="standard"
                            fullWidth
                            value={title_en}
                            onChange={(e) => { setTitleEN(e.target.value) }}
                            error={title_en?.length == 0}
                            helperText={title_en?.length == 0 ? "Title cannot be empty" : ""}
                        />
                    </Card>
                </Stack>
                <Stack mb={5}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Post title VI
                        </Typography>
                        <TextField
                            variant="standard"
                            fullWidth
                            value={title}
                            onChange={(e) => { setTitle(e.target.value) }}
                            error={title?.length == 0}
                            helperText={title?.length == 0 ? "Title cannot be empty" : ""}
                        />
                    </Card>
                </Stack>
                <Stack mb={5} >
                    <Card sx={{ p: 2 }}>
                        <Stack mb={5} sx={{ alignItems: "center" }}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="baseline"
                                spacing={2}
                                sx={{ width: '100%' }}
                            >
                                <h3>Post Cover</h3>
                                <div>
                                    <input
                                        accept="image/*"
                                        id={"file-upload-edit-post-" + id}
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => { handleImageUpload(e) }}
                                    />

                                    <label htmlFor={"file-upload-edit-post-" + id}>
                                        <Button variant="text" color="primary" component="span">
                                            {image ? "Replace image" : "Upload image"}
                                        </Button>
                                    </label>
                                </div>

                            </Stack>
                            <Stack mb={5} sx={{ alignItems: "center" }}>
                                <Box
                                    sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
                                >
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 600, height: 300, textAlign: "center" }}
                                        image={`${image}`}
                                    // alt="about 1"
                                    />
                                </Box>
                            </Stack>
                            <Stack sx={{ alignItems: "center" }}>
                                {
                                    !image &&
                                    <FormHelperText error>
                                        Please upload image.
                                    </FormHelperText>
                                }
                            </Stack>
                        </Stack>
                    </Card>
                </Stack>
                <Stack mb={5} >
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Post Content EN
                        </Typography>
                        <EditorComponent des={content_en} setDes={setContentEN} />
                    </Card>
                </Stack>
                <Stack mb={5} >
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Post Content VI
                        </Typography>
                        <EditorComponent des={content} setDes={setContent} />
                    </Card>
                </Stack>

                <Stack sx={{ m: 2 }} spacing={2} direction="row" justifyContent="space-between">
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" onClick={() => { handleEditPost(id, title, title_en, content, content_en) }}>Save post</Button>
                        <Button variant="text" style={{ color: "gray" }}>Cancel</Button>
                    </Stack>
                    <Button variant="text" color="error" onClick={() => { handleDeletePost(id) }}>Delete product</Button>
                </Stack>
            </Container>
        </>
    );
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