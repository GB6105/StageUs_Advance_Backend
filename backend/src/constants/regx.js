export const id= /^[a-zA-Z0-9]{2,20}$/// 영어, 숫자 가능 2-20글자
export const pw = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[$@$!%*?&]?).{8,16}$/ //영어 숫자 필수, 특수문자 옵션, 8-16글자
export const name = /^[a-zA-Z가-힣0-9]{2,20}$/ //영어,한글 가능 2-20글자
export const birthday = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/ 
export const gender = /^(M|F)$/ //M, F 만 가능;
export const phone = /^010-[0-9]{4}-[0-9]{4}$/ // 010-xxxx-xxxx 가능
export const email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[ a-zA-Z]{2,}$/
export const address = /^[A-Z][a-z]{1,}$/
export const title = /^[a-zA-Zㄱ-ㅎ가-힣0-9$@$!%*?&\s]{2,40}$/ // 영어,한글,숫자,특수문자 가능 2-40글자
export const category = /^(category1|category2|category3)$/ // 지정된 카테고리만 입력 가능
export const content = /^[a-zA-Zㄱ-ㅎ가-힣0-9$@$!%*?&\s]{2,}$/ // 영어, 한글, 숫자, 특수문자 가능 2글자 이상 자유
export const role = /^(admin|user|banned)$/ // 지정된 권한
