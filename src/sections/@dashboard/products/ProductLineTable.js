import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Switch,
    IconButton,
    Stack,
    Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { updateProductGroup, deleteProductGroup } from 'src/api';
import Swal from 'sweetalert2';

export default function ProductLineTable({ groups, setUpdate, update }) {
    const [localGroups, setLocalGroups] = useState([]);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        setLocalGroups([...groups].sort((a, b) => a.order - b.order));
        setIsChanged(false);
    }, [groups]);

    const handleMoveUp = (index) => {
        if (index === 0) return;
        const newGroups = [...localGroups];
        const temp = newGroups[index];
        newGroups[index] = newGroups[index - 1];
        newGroups[index - 1] = temp;
        setLocalGroups(newGroups);
        setIsChanged(true);
    };

    const handleMoveDown = (index) => {
        if (index === localGroups.length - 1) return;
        const newGroups = [...localGroups];
        const temp = newGroups[index];
        newGroups[index] = newGroups[index + 1];
        newGroups[index + 1] = temp;
        setLocalGroups(newGroups);
        setIsChanged(true);
    };

    const handleSaveOrder = async () => {
        Swal.fire({
            title: 'Saving new order...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            for (let i = 0; i < localGroups.length; i++) {
                const group = localGroups[i];
                // Only update if the order value has changed
                if (group.order !== i) {
                    const data = {
                        ...group,
                        order: i+1
                    };
                    await updateProductGroup(data);
                }
            }
            Swal.fire('Thành công', 'Đã lưu thứ tự mới.', 'success');
            setUpdate(!update);
            setIsChanged(false);
        } catch (error) {
            Swal.fire('Lỗi', 'Không thể lưu thứ tự.', 'error');
        }
    };

    const handleStatusChange = async (group, checked) => {
        if (!checked) {
            await Swal.fire({
                text: 'Dòng sản phẩm này sẽ không hiển thị trên giao diện',
                icon: 'info'
            });
        }

        const data = {
            id_group: group.id_group,
            name: group.name,
            detail: group.detail,
            detail_en: group.detail_en,
            editable: group.editable,
            order: group.order,
            is_use: checked ? 1 : 0
        };

        const response = await updateProductGroup(data);
        if (response.results?.status === 'success') {
            Swal.fire('Thành công', 'Đã cập nhật thông tin.', 'success');
            setUpdate(!update);
        }
    };

    const handleEdit = async (group) => {
        const { value: formValues } = await Swal.fire({
            title: 'Sửa dòng sản phẩm',
            width: '800px',
            html:
                '<div style="text-align: left;">' +
                '<label>Name</label>' +
                `<input id="swal-input-name" class="swal2-input" value="${group.name || ''}" placeholder="Name" style="width: 100%; margin: 0; margin-top: 10px;">` +
                '<label style="display: block; margin-top: 10px;">Detail (VI - For SEO)</label>' +
                `<textarea id="swal-input-detail" class="swal2-textarea" placeholder="Detail VI" style="width: 100%; height: 100px; margin: 0; margin-top: 10px;">${group.detail || ''}</textarea>` +
                '<label style="display: block; margin-top: 10px;">Detail (EN - For SEO)</label>' +
                `<textarea id="swal-input-detail-en" class="swal2-textarea" placeholder="Detail EN" style="width: 100%; height: 100px; margin: 0; margin-top: 10px;">${group.detail_en || ''}</textarea>` +
                '</div>',
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                const name = document.getElementById('swal-input-name').value;
                const detail = document.getElementById('swal-input-detail').value;
                const detail_en = document.getElementById('swal-input-detail-en').value;
                if (!name) {
                    Swal.showValidationMessage('Bạn cần nhập tên!');
                    return false;
                }
                return { name, detail, detail_en };
            }
        })

        if (formValues) {
            const { name, detail, detail_en } = formValues;
            const data = {
                id_group: group.id_group,
                name: name,
                detail: detail,
                detail_en: detail_en,
                editable: group.editable,
                order: group.order,
                is_use: group.is_use ? 1 : 0
            };
            const response = await updateProductGroup(data);
            if (response.results?.status === 'success') {
                Swal.fire('Thành công', 'Đã cập nhật thông tin.', 'success');
                setUpdate(!update);
            }
        }
    }

    const handleDelete = async (group) => {
        const { value: confirmName } = await Swal.fire({
            title: 'Xác nhận xoá?',
            text: `Việc xoá product group sẽ xoá luôn các production con bên trong nó. Vui lòng nhập đúng tên "${group.name}" để xác nhận.`,
            input: 'text',
            inputPlaceholder: 'Nhập tên dòng sản phẩm...',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xác nhận xoá',
            inputValidator: (value) => {
                if (!value) {
                    return 'Bạn cần nhập tên dòng sản phẩm!'
                }
                if (value !== group.name) {
                    return 'Tên không khớp!'
                }
            }
        })

        if (confirmName) {
            const response = await deleteProductGroup(group.id_group);
            if (response.results?.status === 'success') {
                Swal.fire('Đã xoá!', 'Dòng sản phẩm đã được xoá.', 'success');
                setUpdate(!update);
            } else {
                Swal.fire('Lỗi', response.results?.msg || 'Không thể xoá dòng sản phẩm.', 'error');
            }
        }
    }

    return (
        <Card sx={{ mt: 3, mb: 3 }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Product Lines (Categories)</Typography>
                {isChanged && (
                    <Button variant="contained" color="warning" onClick={handleSaveOrder}>
                        Save Order
                    </Button>
                )}
            </Box>
            <Box sx={{ minWidth: 600 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Sort</TableCell>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">Name</TableCell>
                            {/* <TableCell align="center">Order</TableCell> */}
                            <TableCell align="center">Is use</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {localGroups.map((group, index) => (
                            <TableRow key={group.id_group}>
                                <TableCell align="center">
                                    <Stack direction="row" justifyContent="center">
                                        <IconButton size="small" onClick={() => handleMoveUp(index)} disabled={index === 0}>
                                            <ArrowUpwardIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleMoveDown(index)} disabled={index === localGroups.length - 1}>
                                            <ArrowDownwardIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                                <TableCell align="center">{group.id_group}</TableCell>
                                <TableCell align="center">{group.name}</TableCell>
                                {/* <TableCell align="center">{group.order}</TableCell> */}
                                <TableCell align="center">
                                    <Switch
                                        checked={group.is_use === 1 }
                                        onChange={(e) => handleStatusChange(group, e.target.checked)}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                {
                                    group.editable ? (
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <IconButton size="small" color="primary" onClick={() => handleEdit(group)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDelete(group)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                    ) : <></>
                                }
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Card>
    );
}
