import { SERVER_URL } from "api";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  position: relative;
  /* gap: 20px; */
  font-size: 14px;
`;

const Label = styled.label`
  font-size: 20px;
  margin-top: 24px;
  margin-bottom: 10px;
`;

const RadioContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Select = styled.select`
  font-size: 14px;
  width: 100px;

  option {
    font-size: 50px;
  }
`;

const Submit = styled.input`
  margin-top: 24px;
  height: 30px;
  width: 100px;
`;

const ErrorMsg = styled.p`
  position: absolute;
  bottom: -20px;
  left: 2px;
  font-size: 12px;
  color: #d22525;
`;

export default function Food({ roomInfo }) {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // 재사용 가능함
  const onSubmit = async (formData) => {
    console.log(formData);

    /* Case 1. ROOM */
    if (roomInfo.role === "leader" || roomInfo.role === "member") {
      // 방 데이터에 추가만 하기
      const res = await fetch(`${SERVER_URL}/recommend/food/${roomInfo.code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) navigate("/standby"); // 대기창으로
    } else if (roomInfo.role === "individual") {
      /* Case 2. Individual */
      // 바로 open ai 로 결과 받아오기
      const res = await fetch(`${SERVER_URL}/recommend/food`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        console.log(data);
        navigate("/result", { state: { result: data.result } });
      } else {
        alert("뭔가 에러가 있네..");
      }
    } else {
      alert("넌 누구야");
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Label>나라</Label>
      <Select {...register("cuisine", { required: true })}>
        <option value="Korean">한식 🇰🇷</option>
        <option value="Japanese">일식 🇯🇵</option>
        <option value="Chinese">중식 🇨🇳</option>
        <option value="Vietnamese">베트남식 🇻🇳</option>
        <option value="American">미국식 🇱🇷</option>
        <option value="Mexican">멕시칸식 🇲🇽</option>
      </Select>

      <Label>종류</Label>
      <RadioContainer>
        <div>
          <input
            {...register("type", {
              required: { value: true, message: "종류 입력해" },
            })}
            type="radio"
            value="rice"
          />
          밥 🍚
        </div>
        <div>
          <input
            {...register("type", {
              required: { value: true, message: "종류 입력해" },
            })}
            type="radio"
            value="meat"
          />
          고기 🍖
        </div>
        <div>
          <input
            {...register("type", {
              required: { value: true, message: "종류 입력해" },
            })}
            type="radio"
            value="noodle"
          />
          면 🍜
        </div>
        <div>
          <input
            {...register("type", {
              required: { value: true, message: "종류 입력해" },
            })}
            type="radio"
            value="fish"
          />
          생선 🐟
        </div>
      </RadioContainer>

      <Label>맵기정도</Label>
      <RadioContainer>
        <div>
          <input
            {...register("spiciness", {
              required: { value: true, message: "맵기 입력해" },
            })}
            type="radio"
            value="no"
          />
          안맵게 😌
        </div>
        <div>
          <input
            {...register("spiciness", {
              required: { value: true, message: "맵기 입력해" },
            })}
            type="radio"
            value="mild"
          />
          조금 맵게 🌶️
        </div>
        <div>
          <input
            {...register("spiciness", {
              required: { value: true, message: "맵기 입력해" },
            })}
            type="radio"
            value="moderately"
          />
          맵게 🌶️🌶️
        </div>
        <div>
          <input
            {...register("spiciness", {
              required: { value: true, message: "맵기 입력해" },
            })}
            type="radio"
            value="very"
          />
          아주맵게 🌶️🌶️🌶️
        </div>
      </RadioContainer>

      <Label>국물</Label>
      <RadioContainer>
        <div>
          <input
            {...register("soup", {
              required: { value: true, message: "국물 입력해" },
            })}
            type="radio"
            value="soup-based"
          />
          yes 👍
        </div>
        <div>
          <input
            {...register("soup", {
              required: { value: true, message: "국물 입력해" },
            })}
            type="radio"
            value="no soup-based"
          />
          no 👎
        </div>
      </RadioContainer>

      <Label>온도</Label>
      <RadioContainer>
        <div>
          <input
            {...register("temperature", {
              required: { value: true, message: "온도 입력해" },
            })}
            type="radio"
            value="cold"
          />
          차가운 ❄️
        </div>
        <div>
          <input
            {...register("temperature", {
              required: { value: true, message: "온도 입력해" },
            })}
            type="radio"
            value="warm"
          />
          따듯한 🔥
        </div>
      </RadioContainer>
      <Submit type="submit" />
      <ErrorMsg>
        {errors.cuisine
          ? errors.cuisine.message.toString()
          : errors.type
          ? errors.type.message.toString()
          : errors.spiciness
          ? errors.spiciness.message.toString()
          : errors.soup
          ? errors.soup.message.toString()
          : errors.temperature
          ? errors.temperature.message.toString()
          : null}
      </ErrorMsg>
    </Form>
  );
}
