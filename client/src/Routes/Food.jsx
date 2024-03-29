import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 20px;
`;

const ErrorMsg = styled.p`
  position: absolute;
  top: 25px;
  left: 2px;
  font-size: 10px;
  color: red;
`;

export default function Food({ roomInfo }) {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    resetField,
    formState: { errors },
  } = useForm();

  // 재사용 가능함
  const onSubmit = (data) => {
    console.log(data);
    if (roomInfo.role === "leader" || roomInfo.role === "member") {
      // 내 결과 서버로 보내고
      // 결과 기다리는 페이지로 가기
      navigate("/standby");
    } else if (roomInfo.role === "individual") {
      // 바로 결과 받아오기
      navigate("/result");
    } else {
      alert("넌 뭐야");
    }
    resetField("spiciness");
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("spiciness", {
          min: { value: 0, message: "0부터 10까지 입력해주세요." },
          max: { value: 10, message: "0부터 10까지 입력해주세요." },
        })}
        type="number"
        placeholder="얼마나 매웠으면 좋겠어? (0~10)"
      />
      {errors.spiciness && (
        <ErrorMsg>{errors.spiciness.message.toString()}</ErrorMsg>
      )}
      <input type="submit" />
    </Form>
  );
}
