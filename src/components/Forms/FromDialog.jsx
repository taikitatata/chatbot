import React, {useState,useCallback} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextInput from "./TextInput"

const FormDialog = (props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");

    const inputName = useCallback((event) => {
        setName(event.target.value)
    }, [setName]);

    const inputEmail = useCallback ((event) => {
        setEmail(event.target.value)
    }, [setEmail]);

    const inputDescription = useCallback((event) => {
        setDescription(event.target.value)
    }, [setDescription]);

    const validatEmail = (email) => {
        const reg = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/;
            return reg.test(email);
    }

    const validateRequired = (...args) => {
        let isBlank = false;
        for(let i = 0; i < args.length; i++) {
            if(args[i] === "") {
                isBlank = true;
            }
        }
        return isBlank
    }

    const submitForm = () => {
        const isBlank = validateRequired(name, email, description);
        const isValidatEmail = validatEmail(email);

        if(isBlank) {
            alert("必須項目が未入力です");
            return false;
        }
        if(!isValidatEmail) {
            alert("メールアドレスを入力して下さい");
            return false;
        }
        const payload = {
            text:   'お問い合わせがありました\n' +
                    '【お名前】 ' + name + '\n' +
                    '【Email】 ' + email + '\n' +
                    '【問い合わせ内容\n' + description
        }

        const url = "https://hooks.slack.com/services/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";
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        }).then(() => {
            alert('送信が完了しました');
            setName("")
            setEmail("")
            setDescription("")
            return props.handleClose()
        })
    }

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">問い合わせフォーム</DialogTitle>
            <DialogContent>
                <TextInput
                    label={"お名前（必須）"} multiline={false} rows={1}
                    value={name} type={"text"} onChange={inputName}
        
                />
                <TextInput
                    label={"メールアドレス（必須）"} multiline={false} rows={1}
                    value={email} type={"email"} onChange={inputEmail}
        
                />
                <TextInput
                    label={"内容"} multiline={true} rows={5}
                    value={description} type={"text"} onChange={inputDescription}
        
                />
            </DialogContent>
            <DialogActions>
            <Button onClick={props.handleClose} color="primary">
                キャンセル
            </Button>
            <Button onClick={submitForm} color="primary" autoFocus>
                送信する
            </Button>
            </DialogActions>
        </Dialog>
    )
}

export default FormDialog