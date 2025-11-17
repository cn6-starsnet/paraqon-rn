const useForgetPwd = () => {
    const onSubmit = (data: {
        email: string,
        password: string
    }) => {
        console.log('表单数据:', data);
    };

    return {
        onSubmit
    }
}

export default useForgetPwd;