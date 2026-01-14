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
        // Separate active (is_use > 0) and inactive (is_use === 0) groups
        const activeGroups = groups.filter(g => g.is_use > 0);
        const inactiveGroups = groups.filter(g => g.is_use === 0);
        // Show active groups first (sorted by is_use), then inactive at the end
        setLocalGroups([...activeGroups, ...inactiveGroups]);
        setIsChanged(false);
    }, [groups]);

    // Get only active groups for reordering
    const activeGroups = localGroups.filter(g => g.is_use > 0);
    const inactiveGroups = localGroups.filter(g => g.is_use === 0);

    const handleMoveUp = (index) => {
        if (index === 0) return;
        const newActiveGroups = [...activeGroups];
        const temp = newActiveGroups[index];
        newActiveGroups[index] = newActiveGroups[index - 1];
        newActiveGroups[index - 1] = temp;
        setLocalGroups([...newActiveGroups, ...inactiveGroups]);
        setIsChanged(true);
    };

    const handleMoveDown = (index) => {
        if (index === activeGroups.length - 1) return;
        const newActiveGroups = [...activeGroups];
        const temp = newActiveGroups[index];
        newActiveGroups[index] = newActiveGroups[index + 1];
        newActiveGroups[index + 1] = temp;
        setLocalGroups([...newActiveGroups, ...inactiveGroups]);
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
            // For descending sort: position 0 = highest is_use, position n-1 = is_use = 1
            const totalActive = activeGroups.length;
            for (let i = 0; i < activeGroups.length; i++) {
                const group = activeGroups[i];
                const newIsUse = totalActive - i; // First item gets highest value
                // Only update if the is_use value has changed
                if (group.is_use !== newIsUse) {
                    const data = {
                        ...group,
                        is_use: newIsUse
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

        // If unchecked: set is_use = 0 (inactive)
        // If checked: set is_use = max(current is_use) + 1 to add to top of list
        const maxIsUse = activeGroups.length > 0 ? Math.max(...activeGroups.map(g => g.is_use)) : 0;
        const newIsUse = checked ? (maxIsUse + 1) : 0;

        const data = {
            id_group: group.id_group,
            name: group.name,
            detail: group.detail,
            detail_en: group.detail_en,
            editable: group.editable,
            is_use: newIsUse
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
                is_use: group.is_use
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

    // Check if a group is in the active section for arrow controls
    const isActiveGroup = (group) => group.is_use > 0;
    const getActiveIndex = (group) => activeGroups.findIndex(g => g.id_group === group.id_group);

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
                            {/* <TableCell align="center">ID</TableCell> */}
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Active</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {localGroups.map((group) => {
                            const isActive = isActiveGroup(group);
                            const activeIndex = getActiveIndex(group);
                            // if(!group.editable) return <></>
                            return (
                                <TableRow key={group.id_group} sx={{ opacity: isActive ? 1 : 0.5 }}>
                                    <TableCell align="center">
                                        {isActive && group.editable ? (
                                            <Stack direction="row" justifyContent="center">
                                                <IconButton size="small" onClick={() => handleMoveUp(activeIndex)} disabled={activeIndex === 0}>
                                                    <ArrowUpwardIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleMoveDown(activeIndex)} disabled={activeIndex === activeGroups.length - 2}>
                                                    <ArrowDownwardIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">—</Typography>
                                        )}
                                    </TableCell>
                                    {/* <TableCell align="center">{group.id_group}</TableCell> */}
                                    <TableCell align="center">{group.name}</TableCell>
                                    <TableCell align="center">
                                        {group.editable ? (
                                            <Switch
                                                checked={group.is_use > 0}
                                                onChange={(e) => handleStatusChange(group, e.target.checked)}
                                            />
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">Always Active</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        {group.editable ? (
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <IconButton size="small" color="primary" onClick={() => handleEdit(group)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDelete(group)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        ) : <></>}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Box>
        </Card>
    );
}
