import React, { useState } from 'react';
import { Form, Input, Select, Modal, Button, ConfigProvider, message, Space } from 'antd';
import { UserOutlined, LockOutlined, DownloadOutlined, CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { register } from "../../../services/api-service";
import { useHistory } from "react-router";

const { Option } = Select;

const handleRegisterClick = async (values, onRegFinish, startSession) => {
    console.log(values);
    const data = JSON.stringify({
        "username": values.username,
        "password": values.password,
        "email": values.email,
        "firstname": values.firstname,
        "lastname": values.lastname,
        "group_name": values.group_name,
        "privateNuber": values.privateNumber,
        "phonenumber": values.number

    });


    const registerRes = await register(data);
    console.log(registerRes.data);
    if (registerRes.data['is_error']) {

        message.error(registerRes.data['Message']);
        window.location.href = "/login";
    } else {
        startSession(registerRes.data);
        message.success(registerRes.data['Message']);
        onRegFinish();
    }
}

const RegisterForm = (props) => {
    let history = useHistory();
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const onRegisterFinish = () => {
        history.push("/application");
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        setIsChecked(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsChecked(false);
    };

    const [autoCompleteResult, setAutoCompleteResult] = useState([]);
    const websiteOptions = autoCompleteResult.map((website) => ({
        label: website,
        value: website,
    }));
    return (
        <ConfigProvider direction="rtl">
            <Form form={form}
                name="register"
                onFinish={(values) => handleRegisterClick(values, onRegisterFinish, props.startSession)}
                scrollToFirstError
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: '!הכנס שם משתמש',
                        },]}
                >
                    <Input prefix={<UserOutlined className="login-from" />} placeholder="שם משתמש" />
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[
                        { type: 'email', message: 'הכנס אימייל חוקי בבקשה!' },
                        { required: true, message: 'הכנס אימייל בבקשה!' },
                    ]}
                >

                    <Input prefix={<UserOutlined className="" />} placeholder="אי-מייל" />
                </Form.Item>
                <Form.Item
                    name="password"
                    tooltip="מומלץ להשתמש בתווים ואותיות על מנת ליצור סיסמה חזקה"
                    rules={[{ required: true, message: 'הכנס סיסמה!' }]}
                    hasFeedback
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="סיסמה" />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'אנא חזור על הסיסמה' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('הסיסמה שהזנת לא זהה לסיסמה שבחרת'));
                            },
                        }),
                    ]}>
                    <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="סיסמה" />
                </Form.Item>
                <Form.Item
                    name="firstname"
                    rules={[
                        {
                            required: true,
                            message: 'אנא הזן שם פרטי!',
                            whitespace: true,
                        },
                    ]}>
                    <Input placeholder="שם פרטי" />
                </Form.Item>
                <Form.Item
                    name="lastname"
                    rules={[
                        {
                            required: true,
                            message: 'אנא הזן שם משפחה!',
                            whitespace: true,
                        },
                    ]}>
                    <Input placeholder="שם משפחה" />
                </Form.Item>
                <Form.Item
                    name="phone"
                    rules={[
                        {

                            required: true,
                            message: 'אנא הזן מספר טלפון',
                        },
                    ]}>
                    <Input placeholder="מספר טלפון"
                    />
                </Form.Item>
                <Form.Item name="group_name" rules={[{ required: true, message: 'יש לבחור סוג משתמש' }]}>
                    <Select placeholder="בחר" allowClear>
                        <Option value="soldier">חייל</Option>
                        <Option value="volunteer">מתנדב</Option>
                        <Option value="staff">איש צוות</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.group_name !== currentValues.group_name}>
                    {({ getFieldValue }) =>
                        getFieldValue('group_name') === 'soldier' ? (
                            <Form.Item
                                name="privateNumber"

                                rules={[
                                    {
                                        required: true,
                                        message: 'אנא הזן מספר אישי',
                                    },
                                ]}>
                                <Input placeholder="מספר אישי"
                                />
                            </Form.Item>) : null}
                </Form.Item>
                <Space>
                    <Form.Item

                        name="agreement"
                        valuePropName="checked"
                        rules={[
                            {
                                required: false,
                                message: "נא לאשר"
                            },
                        ]}
                    >
                        {isChecked ? <CheckCircleOutlined style={{ color: "green" }} /> :
                            <CloseOutlined style={{ color: "red" }} />}
                        <Space>
                            <h3 style={{ color: 'white' }}> קראתי ואני מאשר את  </h3>
                            <a className={"takanon"} onClick={showModal} style={{ fontSize: 20, fortWeigt: 'bold' }} > התקנון </a>

                            {!isChecked && <h5 style={{ color: "red" }}>
                            </h5>}
                        </Space>
                        <Modal title="תקנון" visible={isModalVisible} onOk={handleOk} okText="מאשר" onCancel={handleCancel}
                            cancelText="חזרה">
                            <p>מטעמי נוחות נוקט התקנון בלשון זכר, ואולם כל הנאמר בו מתייחס לנשים ולגברים כאחד.
                            השימוש באתר על תכניו והשירותים הניתנים בו, מוצעים לך בכפוף לקבלתך את כל התנאים הכלולים
                            בתקנון זה.
                            הגלישה באתר ו/או הרשמתך כמנוי לקבלת שירותיו, ייחשבו להסכמה מצדך לתנאים אלה.
                            הנהלת האתר רשאית להשעות, לחסום או להפסיק לאלתר את גישת הגולש לשירות אם יפר את תנאי התקנון.
                            הנהלת האתר רשאית לעדכן את תנאי התקנון מעת לעת.
                            אין לעשות באתר או באמצעותו כל שימוש למטרות בלתי חוקיות.
                            ההרשמה כמנוי מיועדת ומותרת לגילאי ח"י ומעלה בלבד. בהרשמתך הנך מצהיר כי גילך אכן מעל 18 שנה.
                            אין לרשום אדם אחר שלא בהסכמתו ו/או ללא נוכחותו מול המסך בשעת הרישום ולאחר שהוסברו לו כל תנאי
                            תקנון זה.
                            הרישום באתר הוא לשימוש האישי והבלעדי של הגולש אשר אינו רשאי להעביר את הרשאת השימוש לאדם אחר
                            כלשהו. חובה מיוחדת לדייק לחלוטין בכל הפרטים האישיים הנדרשים לצורך הרישום ולצורך הקשר השוטף
                            עם המנוי.
                            אין לפרסם או להעביר באמצעות האתר כל מידע שהוא שקרי, מעליב, משמיץ, מאיים, פוגע בפרטיות הזולת,
                            פורנוגרפי, בעל אופי מיני, גזעני, או בלתי חוקי.
                            הנך אחראי באופן בלעדי לנכונות המידע אותו תפרסם או תעביר באמצעות האתר. הנהלת האתר אינה מקבלת
                            על עצמה כל אחריות לתכנים המפורסמים או מועברים בין המנויים.
                            אין לעשות באתר כל שימוש מסחרי בדרך של משלוח פרסומות או בכל דרך אחרת.
                            אין לשלוח באמצעות האתר הודעה המיועדת ליותר מ- 5 נמענים.
                            הנך מצהיר כי ידוע לך שלהנהלת האתר אין כל יכולת או אפשרות לבדוק, לנפות או לסנן את המנויים
                            הנרשמים לאתר.
                            כל קשר וירטואלי או אחר שלך עם מי מהמנויים האחרים באתר, וזאת בין בהתכתבות או בצ'ט ובין במסגרת
                            "פגישות "אמת", הן באחריותך הבלעדית. מומלץ ביותר לשקול היטב ולוודא את מירב הפרטים אודות הצד
                            השני לפני כל מפגש כזה, וכן לנקוט באמצעי זהירות מרביים לפני הפגישה הראשונה עם אדם לא מוכר.
                            בשום מקרה לא תהיה להנהלת האתר כל אחריות לתוצאות כל קשר כאמור, ומבלי לגרוע מכלליות האמור לעיל
                            לנזקים פיזיים, נפשיים, כספיים, רגשיים ואחרים.
                            בכוונת הנהלת האתר כי האתר ושירותיו יהיו זמינים בכל עת. יחד עם זאת אין ביכולת הנהלת האתר
                            להתחייב לזמינות רצופה ללא תקלות וללא "נפילות". כמו כן רשאית הנהלת האתר להפסיק את השימוש באתר
                            מעת לעת לצורכי תחזוקתו וארגונו. לא יינתן כל פיצוי כספי/זיכוי בשל תקלות או הפסקות בשירות.
                            כל זכויות הקניין הרוחני וזכויות היוצרים בקשר לאתר הם של הנהלת האתר.
                            הנהלת האתר אינה אחראית לתוכן מודעות, "באנרים" או לכל חומר פרסומי באתר. האחריות לכך על
                            המפרסמים בלבד.
                            הימצאותם של קישורים ("לינקים") לאתרים אחרים אינם מהווים ערובה לתכנים באתרים אלה מבחינת
                            מהימנותם, שלמותם, או מכל בחינה אחרת.
                            על התקנון יחול הדין הישראלי. סמכות השיפוט לגביו לבתי המשפט המוסמכים בתל אביב.

                            ושלוש הערות לפני סיום:

                            1. תקנון זה הוכן על ידי עבור אתר היכרויות למגזר מסוים, והוא מותאם במיוחד לכך. מומלץ להתאים
                            את התקנון של כל אתר לאופי שלו, הענף בו הוא ממוצב, השירותים אותם ניתן לקבל בו, קהל היעד של
                            האתר והסיכונים המיוחדים לו.

                            2. אני סבור כי מטרת התקנון להבהיר לציבור המשתמשים בלשון ברורה את "כללי המשחק" של אתר מסוים.
                            יש המכבירים מילים ועורכים תקנון ארוך ומסובך של אין סוף סעיפים בלשון משפטית מורכבת. לתפיסתי
                            שלי על התקנון להיות תמציתי ובלשון פשוטה וברורה, אחרת נימצא מחטיאים כליל את המטרה.

                            2. תקנון באתר אינטרנט הוא בגדר "חוזה אחיד" כהגדרתו בחוק החוזים האחידים - "חוזה שתנאיו, כולם
                            או מקצתם, נקבעו מראש בידי צד אחד כדי שישמשו תנאים לחוזים רבים בינו לבין אנשים בלתי מסוימים
                            במספרם או בזהותם". לבתי המשפט יש סמכות לבטל בחוזה אחיד סעיפים מקפחים הפוגעים בצד השני באופן
                            בלתי סביר. ואכן לא אחת קבעו בתי המשפט כי סעיף זה או אחר הוא בגדר "סעיף מקפח" - למשל פטור
                            גורף מאחריות, הכתבת המיקום הגיאוגרפי של בית המשפט הרלוונטי, וכיו"ב. </p>

                        </Modal>
                    </Form.Item>
                    <Form.Item>
                        <Button style={{ color: "white", background: "lime", border: "lime" }} type="primary" shape="round" className="singup-btn" icon={<DownloadOutlined />}
                            htmlType="submit">
                            הירשם
                    </Button>
                    </Form.Item>
                </Space>

            </Form>
        </ConfigProvider>
    );
};

export default RegisterForm;