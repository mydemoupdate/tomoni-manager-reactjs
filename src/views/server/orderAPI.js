import axios from "axios";
const baseDomain = 'http://139.180.207.4:83';
const baseUrl = `${baseDomain}/api/`;
// const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiMDVhOWFhNDU4NmI3Zjg3ZDhlNzU1ZDE3ZmIzMmM0ODI4ZTg1YTZkZjg5OGEzMTAxNTgyZTZiMDU2ZmI0OTdmY2JkYjg0NTljYzJhZTRiMjIiLCJpYXQiOjE1OTgxNjk3MjgsIm5iZiI6MTU5ODE2OTcyOCwiZXhwIjoxNTk5NDY1NzI4LCJzdWIiOiJhZG1pbiIsInNjb3BlcyI6WyIqIl19.FWpjJorBZ4WehN5-ILLafLnC3a9qnU5RzGN9VoVE7WiUtEYvfwgFgKYc2iBOXSDemsdUhVDjv-W4VUTdfN5rg_88nc4xKSdkIvmtgytYiunD5qySs_zXQOrYlLYOwUsHX-706yfHrnyem6C9WVm8Wf0AW5bYafQ25wC1aLomH7IAlZSWoqvPBV9nVGb9wtCM_8Zhua-bnNabx-Pt7HjLRT5oi8-AAX5Cq4xT4DZzVyDXgYW6TIdfkgulNMfNqSTkoGRs3J9jdUlUs2r4s9O4n5Gi7dpMOU3DUWSbxxd2Uo4nUUU7gXXSzHde0sfVlsque_oxfjvKrk02eHJ6DDD2y_vlw2Of-wdM_VTl6YjZZ8Omp50NT-1N1h1AD0YiBPPfs1gAU9jnFUpqJ-8Dl6pSzxCmjq1qpX88lvsOD7K6VDlqmv8PrhYi3o4DPzSerY6FXFnxW4TTFr0XbB0Tq8HnsJM4e8Qz9MvqgmEUGJJDAAvssknwUh2tNdZvUpa7Yg3Svv0Jp_UX3YVggCcxeHnmdKp3-ZpdJMuQ17RztMEuvN7DW5vXzUhDNfnyUWvjzGgO7rXjQEIcc8jRb7AAgmcye0hEARbH6cey7JVVWeEnD9JP4v_udwF1CUBjNUAACYYfMJ-xCZqJsqtGBILmb2tvA5gzfeIZso9xLBl4cyX2lrc';
export const token = localStorage.getItem("accessToken");
export const languagePage= localStorage.getItem('language')
export default axios.create({
    'baseURL': baseUrl,
    headers: {
        'Authorization': `Bearer ${token}`,
        'Accept-Language':languagePage?languagePage:'vi'
    }
})